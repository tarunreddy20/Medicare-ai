"""In-memory store for cart, orders, appointments, and lab bookings."""
import uuid
from datetime import datetime

from app.mock_data.medicines import MEDICINES
from app.mock_data.lab_tests import LAB_TESTS
from app.mock_data.doctors import DOCTORS

# In-memory storage
_carts: dict[str, list[dict]] = {}
_orders: dict[str, list[dict]] = {}
_appointments: dict[str, list[dict]] = {}
_lab_bookings: dict[str, list[dict]] = {}


def _find_medicine(item_id: str) -> dict | None:
    return next((m for m in MEDICINES if m["id"] == item_id), None)


def _find_lab_test(item_id: str) -> dict | None:
    return next((t for t in LAB_TESTS if t["id"] == item_id), None)


def _find_doctor(doctor_id: str) -> dict | None:
    return next((d for d in DOCTORS if d["id"] == doctor_id), None)


# ============ Cart ============

def get_cart(user_id: str) -> dict:
    items = _carts.get(user_id, [])
    total = sum(i["discounted_price"] * i["quantity"] for i in items)
    savings = sum((i["price"] - i["discounted_price"]) * i["quantity"] for i in items)
    return {"user_id": user_id, "items": items, "total": total, "savings": savings}


def add_to_cart(user_id: str, item_id: str, item_type: str, quantity: int = 1) -> dict:
    if user_id not in _carts:
        _carts[user_id] = []

    # Check if item already in cart
    for item in _carts[user_id]:
        if item["item_id"] == item_id:
            item["quantity"] += quantity
            return get_cart(user_id)

    # Find item details
    if item_type == "medicine":
        source = _find_medicine(item_id)
    else:
        source = _find_lab_test(item_id)

    if not source:
        return get_cart(user_id)

    _carts[user_id].append({
        "item_id": item_id,
        "item_type": item_type,
        "name": source["name"],
        "price": source["price"],
        "discounted_price": source.get("discounted_price", source["price"]),
        "quantity": quantity,
    })
    return get_cart(user_id)


def remove_from_cart(user_id: str, item_id: str) -> dict:
    if user_id in _carts:
        _carts[user_id] = [i for i in _carts[user_id] if i["item_id"] != item_id]
    return get_cart(user_id)


def update_cart_quantity(user_id: str, item_id: str, quantity: int) -> dict:
    if user_id in _carts:
        for item in _carts[user_id]:
            if item["item_id"] == item_id:
                if quantity <= 0:
                    return remove_from_cart(user_id, item_id)
                item["quantity"] = quantity
                break
    return get_cart(user_id)


# ============ Orders ============

def place_order(user_id: str, delivery_name: str, delivery_address: str,
                delivery_city: str, delivery_pincode: str, delivery_phone: str,
                payment_method: str) -> dict | None:
    cart = _carts.get(user_id, [])
    if not cart:
        return None

    order = {
        "order_id": f"ORD-{uuid.uuid4().hex[:8].upper()}",
        "user_id": user_id,
        "items": [{"item_id": i["item_id"], "name": i["name"], "price": i["discounted_price"], "quantity": i["quantity"]} for i in cart],
        "total": sum(i["discounted_price"] * i["quantity"] for i in cart),
        "delivery_name": delivery_name,
        "delivery_address": f"{delivery_address}, {delivery_city} - {delivery_pincode}",
        "delivery_phone": delivery_phone,
        "payment_method": payment_method,
        "status": "confirmed",
        "created_at": datetime.now().isoformat(),
    }

    if user_id not in _orders:
        _orders[user_id] = []
    _orders[user_id].append(order)

    # Clear cart
    _carts[user_id] = []
    return order


def get_orders(user_id: str) -> list[dict]:
    return _orders.get(user_id, [])


# ============ Appointments ============

def book_appointment(user_id: str, doctor_id: str, date: str, time_slot: str, reason: str = "") -> dict | None:
    doctor = _find_doctor(doctor_id)
    if not doctor:
        return None

    appointment = {
        "appointment_id": f"APT-{uuid.uuid4().hex[:8].upper()}",
        "user_id": user_id,
        "doctor_id": doctor_id,
        "doctor_name": doctor["name"],
        "doctor_specialty": doctor["specialty"],
        "hospital": doctor["hospital"],
        "fee": doctor["fee"],
        "date": date,
        "time_slot": time_slot,
        "reason": reason,
        "status": "confirmed",
        "created_at": datetime.now().isoformat(),
    }

    if user_id not in _appointments:
        _appointments[user_id] = []
    _appointments[user_id].append(appointment)
    return appointment


def get_appointments(user_id: str) -> list[dict]:
    return _appointments.get(user_id, [])


# ============ Lab Bookings ============

def book_lab_test(user_id: str, test_id: str, date: str, time_slot: str,
                  address: str, city: str, pincode: str, phone: str) -> dict | None:
    test = _find_lab_test(test_id)
    if not test:
        return None

    booking = {
        "booking_id": f"LAB-{uuid.uuid4().hex[:8].upper()}",
        "user_id": user_id,
        "test_id": test_id,
        "test_name": test["name"],
        "price": test["discounted_price"],
        "date": date,
        "time_slot": time_slot,
        "address": f"{address}, {city} - {pincode}",
        "phone": phone,
        "sample_type": test["sample_type"],
        "status": "confirmed",
        "created_at": datetime.now().isoformat(),
    }

    if user_id not in _lab_bookings:
        _lab_bookings[user_id] = []
    _lab_bookings[user_id].append(booking)
    return booking


def get_lab_bookings(user_id: str) -> list[dict]:
    return _lab_bookings.get(user_id, [])
