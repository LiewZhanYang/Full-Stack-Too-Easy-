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

export default function StripePayment(props) {

    const { totalPrice, programId, selectedChildren, SessionID, UserID } = props; // Destructure props
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch("http://localhost:8000/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: totalPrice*100 }),
        })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }, []);

    return (
        <>
            {stripePromise && clientSecret && (
                <Elements stripe={stripePromise} options={ {clientSecret} }>
                    <CheckoutForm 
                        programId={programId}
                        selectedChildren={selectedChildren}
                        SessionID={SessionID}
                        userId={UserID}
                        totalPrice={totalPrice}
                    />
                </Elements>
            )}
        </>
    );
}