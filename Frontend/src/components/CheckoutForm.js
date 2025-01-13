import { useState, useEffect } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }
        setIsLoading(true);
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
              // Make sure to change this to your payment completion page
                return_url: "http://localhost:3000/complete",
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
            <button disabled={isLoading} id="submit">
                <span id="button-text">
                    {isLoading ? "Loading ..." : "Pay Now"}
                </span>
            </button>
        </form>
    )
}
