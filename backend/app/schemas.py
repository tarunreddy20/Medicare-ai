from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    message: str
    specialty: Optional[str] = None
    user_id: Optional[str] = None


class ChatMessage(BaseModel):
    sender: str
    text: str


class ChatResponse(BaseModel):
    reply: str
    redirected_specialty: Optional[str] = None
    applied_specialty: Optional[str] = None


class HistoryResponse(BaseModel):
    user_id: str
    specialty: str
    messages: list[ChatMessage]


# ============ Cart ============

class CartAddRequest(BaseModel):
    user_id: str
    item_id: str
    item_type: str  # "medicine" or "lab_test"
    quantity: int = 1


class CartItemResponse(BaseModel):
    item_id: str
    item_type: str
    name: str
    price: float
    discounted_price: float
    quantity: int


class CartResponse(BaseModel):
    user_id: str
    items: list[CartItemResponse]
    total: float
    savings: float


# ============ Orders ============

class OrderRequest(BaseModel):
    user_id: str
    delivery_name: str
    delivery_address: str
    delivery_city: str
    delivery_pincode: str
    delivery_phone: str
    payment_method: str  # "COD", "UPI", "Card"


class OrderItemResponse(BaseModel):
    item_id: str
    name: str
    price: float
    quantity: int


class OrderResponse(BaseModel):
    order_id: str
    user_id: str
    items: list[OrderItemResponse]
    total: float
    delivery_address: str
    payment_method: str
    status: str
    created_at: str


# ============ Appointments ============

class AppointmentRequest(BaseModel):
    user_id: str
    doctor_id: str
    date: str
    time_slot: str
    reason: str = ""


class AppointmentResponse(BaseModel):
    appointment_id: str
    user_id: str
    doctor_name: str
    doctor_specialty: str
    hospital: str
    date: str
    time_slot: str
    reason: str
    status: str
    created_at: str


# ============ Lab Bookings ============

class LabBookingRequest(BaseModel):
    user_id: str
    test_id: str
    date: str
    time_slot: str
    address: str
    city: str
    pincode: str
    phone: str


class LabBookingResponse(BaseModel):
    booking_id: str
    user_id: str
    test_name: str
    date: str
    time_slot: str
    address: str
    sample_type: str
    status: str
    created_at: str
