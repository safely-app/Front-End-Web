import React from 'react';
import { loadStripe, StripeCardElement } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { notifyError } from '../utils';
import { Button } from '../common';
import log from 'loglevel';
import './Profiles.css';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC as string);

const CardRegister: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '20px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        }
    };

    const submitPaymentMethod = async () => {
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement as StripeCardElement
        });

        if (error) {
            log.error(error);
            notifyError(error.message as string);
        } else {
            log.log("Success!", paymentMethod);
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Enregistrer une solution de payement</h2>
            <div className="stripe-container">
                <div className="stripe-main">
                    <CardElement options={cardElementOptions} />
                </div>
            </div>
            <Button
                text="Enregistrer"
                onClick={submitPaymentMethod}
                disabled={!stripe}
            />
        </div>
    );
};

const Stripe: React.FC = () => {
    return (
        <Elements stripe={stripePromise}>
            <CardRegister />
        </Elements>
    );
};

export default Stripe;