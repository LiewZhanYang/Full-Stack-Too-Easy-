import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";
import { Check } from "lucide-react";


// FOR CHERYL / MONISHA 
// Store amount in localstorage, then multiply by 100, not sure ask CADEN
// const amount = localStorage.getItem("amount");



// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51QRx0kG1MaTqtP83A1bjOVMHB8mwcVhkQXB78H4P09xvzdujOBWNPecVloIGJQqPxp9vGZRJNtqllzBw83IzG80300ScbDBaxz");

export default function StripePayment() {
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch("http://localhost:8000/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // $50 = amount: 5000 (must multiply by 100)
            body: JSON.stringify({ amount: amount }),
        })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }, []);

    return (
        <>
            <h1>React Stripe and the Payment Element</h1>
            {stripePromise && clientSecret && (
                <Elements stripe={stripePromise} options={ {clientSecret} }>
                    <CheckoutForm />
                </Elements>
            )}
        </>
    );
}