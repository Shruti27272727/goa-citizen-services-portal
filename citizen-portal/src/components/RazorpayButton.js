import React from "react";
import Button from "./Button"; // your generic button

const RazorpayButton = ({ order, user, onPaymentSuccess }) => {
  const handleMockPayment = () => {
    if (!order?.id) {
      alert("Payment order not found!");
      return;
    }

    const mockResponse = {
      razorpay_payment_id: `MOCK_PAY_${Math.floor(Math.random() * 1_000_000)}`,
      order_id: order.id,
      amount: order.amount,
    };

    alert(`Payment successful! Payment ID: ${mockResponse.razorpay_payment_id}`);

    if (onPaymentSuccess) onPaymentSuccess(mockResponse);
  };

  return <Button text="Pay Now" onClick={handleMockPayment} />;
};

export default RazorpayButton;
