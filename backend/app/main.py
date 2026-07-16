from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
from typing import Optional
from dotenv import load_dotenv

from app.ai import generate_reply
from app.history_store import add_chat_message, get_chat_history
from app.schemas import (
    ChatRequest, ChatResponse, HistoryResponse,
    CartAddRequest, CartResponse,
    OrderRequest, OrderResponse,
    AppointmentRequest, AppointmentResponse,
    LabBookingRequest, LabBookingResponse,
)
from app.specialty_router import detect_best_specialty
from app.mock_data import DOCTORS, MEDICINES, LAB_TESTS, SURGERIES
from app import store

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Medical Chatbot API",
    version="1.0.0"
)

default_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:3000",
    "http://localhost:4173"
]
configured_origins = os.getenv("CORS_ORIGINS")
if configured_origins:
    allow_origins = [origin.strip() for origin in configured_origins.split(",")]
else:
    allow_origins = default_origins

# CORS (for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "Backend is running", "message": "Medical Chatbot API is ready"}

@app.get("/api/health")
def api_health_check():
    return {
        "status": "ok",
        "service": "medical-chatbot-api"
    }

@app.get("/api/config-status")
def config_status():
    azure_ready = bool(
        os.getenv("AZURE_OPENAI_ENDPOINT") and
        os.getenv("AZURE_OPENAI_API_KEY") and
        os.getenv("AZURE_OPENAI_DEPLOYMENT")
    )
    openai_ready = bool(os.getenv("OPENAI_API_KEY"))

    return {
        "llm_configured": azure_ready or openai_ready,
        "provider": "azure-openai" if azure_ready else ("openai" if openai_ready else "none"),
        "model": os.getenv("AZURE_OPENAI_DEPLOYMENT") or os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Process chat messages and return responses"""
    try:
        message = request.message.strip()
        requested_specialty = (request.specialty or "general-surgery").strip().lower()
        user_id = (request.user_id or "anonymous-user").strip() or "anonymous-user"

        applied_specialty = detect_best_specialty(message, requested_specialty)
        redirected_specialty = applied_specialty if applied_specialty != requested_specialty else None

        logger.info("Processing message for user=%s requested=%s applied=%s", user_id, requested_specialty, applied_specialty)
        reply = generate_reply(message, applied_specialty)

        add_chat_message(user_id, applied_specialty, "user", message)
        add_chat_message(user_id, applied_specialty, "bot", reply)

        logger.info(f"Generated reply successfully")
        return {
            "reply": reply,
            "redirected_specialty": redirected_specialty,
            "applied_specialty": applied_specialty,
        }
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}", exc_info=True)
        return {"reply": "I apologize, but I encountered an error. Please try again."}


@app.get("/api/history", response_model=HistoryResponse)
async def history_endpoint(user_id: str, specialty: str, limit: int = 50):
    """Fetch persisted chat history for a user and specialty."""
    normalized_user = user_id.strip() or "anonymous-user"
    normalized_specialty = specialty.strip().lower()
    capped_limit = max(1, min(limit, 100))

    messages = get_chat_history(normalized_user, normalized_specialty, capped_limit)
    return {
        "user_id": normalized_user,
        "specialty": normalized_specialty,
        "messages": messages,
    }


# ============ Doctors ============

@app.get("/api/doctors")
def list_doctors(specialty: Optional[str] = None, city: Optional[str] = None, search: Optional[str] = None):
    results = DOCTORS
    if specialty:
        results = [d for d in results if d["specialty"] == specialty.lower()]
    if city:
        results = [d for d in results if d["city"].lower() == city.lower()]
    if search:
        q = search.lower()
        results = [d for d in results if q in d["name"].lower() or q in d["hospital"].lower()]
    return {"doctors": results}


@app.get("/api/doctors/{doctor_id}")
def get_doctor(doctor_id: str):
    doctor = next((d for d in DOCTORS if d["id"] == doctor_id), None)
    if not doctor:
        return {"error": "Doctor not found"}
    return doctor


# ============ Medicines ============

@app.get("/api/medicines")
def list_medicines(category: Optional[str] = None, search: Optional[str] = None):
    results = MEDICINES
    if category:
        results = [m for m in results if m["category"].lower() == category.lower()]
    if search:
        q = search.lower()
        results = [m for m in results if q in m["name"].lower() or q in m["description"].lower()]
    return {"medicines": results}


# ============ Lab Tests ============

@app.get("/api/lab-tests")
def list_lab_tests():
    return {"lab_tests": LAB_TESTS}


@app.get("/api/lab-tests/{test_id}")
def get_lab_test(test_id: str):
    test = next((t for t in LAB_TESTS if t["id"] == test_id), None)
    if not test:
        return {"error": "Lab test not found"}
    return test


# ============ Surgeries ============

@app.get("/api/surgeries")
def list_surgeries():
    return {"surgeries": SURGERIES}


# ============ Cart ============

@app.get("/api/cart/{user_id}")
def get_cart(user_id: str):
    return store.get_cart(user_id)


@app.post("/api/cart")
def add_to_cart(request: CartAddRequest):
    return store.add_to_cart(request.user_id, request.item_id, request.item_type, request.quantity)


@app.delete("/api/cart/{user_id}/{item_id}")
def remove_from_cart(user_id: str, item_id: str):
    return store.remove_from_cart(user_id, item_id)


@app.put("/api/cart/{user_id}/{item_id}")
def update_cart_item(user_id: str, item_id: str, quantity: int = Query(...)):
    return store.update_cart_quantity(user_id, item_id, quantity)


# ============ Orders ============

@app.post("/api/orders")
def create_order(request: OrderRequest):
    order = store.place_order(
        request.user_id, request.delivery_name, request.delivery_address,
        request.delivery_city, request.delivery_pincode, request.delivery_phone,
        request.payment_method
    )
    if not order:
        return {"error": "Cart is empty"}
    return order


@app.get("/api/orders/{user_id}")
def get_orders(user_id: str):
    return {"orders": store.get_orders(user_id)}


# ============ Appointments ============

@app.post("/api/appointments")
def create_appointment(request: AppointmentRequest):
    appointment = store.book_appointment(
        request.user_id, request.doctor_id, request.date, request.time_slot, request.reason
    )
    if not appointment:
        return {"error": "Doctor not found"}
    return appointment


@app.get("/api/appointments/{user_id}")
def get_appointments(user_id: str):
    return {"appointments": store.get_appointments(user_id)}


# ============ Lab Bookings ============

@app.post("/api/lab-bookings")
def create_lab_booking(request: LabBookingRequest):
    booking = store.book_lab_test(
        request.user_id, request.test_id, request.date, request.time_slot,
        request.address, request.city, request.pincode, request.phone
    )
    if not booking:
        return {"error": "Lab test not found"}
    return booking


@app.get("/api/lab-bookings/{user_id}")
def get_lab_bookings(user_id: str):
    return {"lab_bookings": store.get_lab_bookings(user_id)}
