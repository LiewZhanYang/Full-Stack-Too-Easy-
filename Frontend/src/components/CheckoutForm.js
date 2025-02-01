import { useState, useEffect } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { PaymentElement } from "@stripe/react-stripe-js";
import axios from "axios";
const lunchOptionMapping = {
    chicken: 1,
    fish: 2,
    veggie: 3,
};

export default function CheckoutForm(props) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const { programId, userId, selectedChildren, SessionID, totalPrice } = props; // Destructure props

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Handling Stripe Payment
        if (!stripe || !elements) {
            return;
        }
        setIsLoading(true);

        // Update Database
        console.log(SessionID)
        console.log(userId);
        console.log(totalPrice)
        try {
            // Create a FormData object
            const formData = new FormData();
            formData.append("InvoiceID", Math.floor(100000 + Math.random() * 900000)); // Generate a numeric InvoiceID
            formData.append("Amount", totalPrice);
            formData.append("CreatedAt", new Date().toISOString());
            formData.append("Status", "Pending");
            formData.append("InvoicePath", "default.png"); // You can change this if necessary
            formData.append("SessionID", SessionID);
            formData.append("PaidBy", userId);
            // Convert lunch options to numeric IDs before submitting
            formData.append(
                "SelectedChildren",
                JSON.stringify(
                    selectedChildren.map((child) => ({
                    ChildID: child.ChildID,
                    lunchOption: lunchOptionMapping[child.lunchOption] || null, // Convert to numeric ID
                    }))
                )
            );
        
            // Send the FormData using axios
            const response = await axios.post(
            "http://localhost:8000/payment",
            formData,
            {
                headers: {
                "Content-Type": "multipart/form-data",
                },
            }
            );
    
            // Handle response
            if (response.data && response.data.OrderID) {
                setOrderId(response.data.OrderID);
                setIsConfirmed(true);
                console.log(
                    "Payment submitted successfully. Order ID:",
                    response.data.OrderID
            );
    
            // Create signups for selected children
            for (const child of selectedChildren) {
                const signUpDetails = {
                AccountID: parseInt(userId, 10),
                SessionID: SessionID,
                LunchOptionID: lunchOptionMapping[child.lunchOption] || null, // Use numeric ID
                ChildID: child.ChildID,
                };
    
                console.log("Creating signup for child:", signUpDetails);
    
                try {
                const signupResponse = await axios.post(
                    `http://localhost:8000/signup/`,
                    signUpDetails
                );
    
                if (signupResponse.data && signupResponse.data.success) {
                    console.log(
                    "Signup created successfully:",
                    signupResponse.data.signUpId
                    );
                } else {
                    throw new Error("Signup creation failed");
                }
                } catch (error) {
                    console.error(
                        "Error creating signup for child:",
                        child.ChildID,
                        error
                    );
                    alert(`Failed to create signup for child: ${child.ChildID}.`);
                }
            }
    
            alert("Payment submitted and signups created successfully!");

            } else {
                throw new Error("Order ID was not returned in the response data.");
            }
        } catch (error) {
            if (error.response) {
                console.error("Error response from server:", error.response.data);
                alert(
                    `Failed to submit payment or create signup. Server responded with: ${error.response.data.message}`
                );
            } else if (error.request) {
                console.error("No response from server. Request was:", error.request);
                alert("Failed to submit payment. No response from server.");
            } else {
                console.error("Unexpected error:", error.message);
                alert(
                    `Failed to submit payment or create signup. Error: ${error.message}`
            );
            }
        } finally {
            setTimeout(() => {
            setIsProcessing(false);
            }, 2000);
        }
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
              // Make sure to change this to your payment completion page
                return_url: "http://localhost:3000/dashboard",
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement />
            <button className="stripe-button" disabled={isLoading} id="submit">
                <span id="button-text">
                    {isLoading ? "Loading ..." : "Submit"}
                </span>
            </button>
        </form>
    )
}
