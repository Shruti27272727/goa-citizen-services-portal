import React, { useState } from "react";
import Button from "./Button"; 

const RazorpayButton = ({ order, user, onPaymentSuccess }) => {
  const [processing, setProcessing] = useState(false);

  const handleMockPayment = () => {
    if (!order?.id) {
      alert("Payment order not found!");
      return;
    }

    setProcessing(true);

    
    setTimeout(() => {
      const mockResponse = {
        razorpay_payment_id: `MOCK_PAY_${Math.floor(Math.random() * 1_000_000)}`,
        order_id: order.id,
        amount: order.amount,
      };

      alert(`Payment successful! Payment ID: ${mockResponse.razorpay_payment_id}`);

      if (onPaymentSuccess) onPaymentSuccess(mockResponse);

      setProcessing(false);
    }, 500); 
  };

  return (
    <Button
      text={processing ? "Processing..." : "Pay Now"}
      onClick={handleMockPayment}
      disabled={processing}
    />
  );
};

export default RazorpayButton;
