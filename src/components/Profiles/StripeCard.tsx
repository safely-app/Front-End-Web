import React from 'react';
import { loadStripe, PaymentMethod, StripeCardElement } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { notifyError } from '../utils';
import log from 'loglevel';
import './Profiles.css';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC as string);

interface ICardRegister {
  onSubmit: (value: PaymentMethod) => void;
}

const CardRegister: React.FC<ICardRegister> = ({
  onSubmit
}) => {
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
      notifyError(error);
    } else if (paymentMethod) {
      log.log("Success!", paymentMethod);
      onSubmit(paymentMethod);
    }
  };

  return (
    <div className='text-center'>
      <p className='font-bold text-xl mt-2 mb-4'>Enregistrer une solution de paiement</p>
      <div className='flex justify-center items-center m-3'>
        <div className='stripe-main'>
          <CardElement options={cardElementOptions} />
        </div>
      </div>
      <button className='bg-blue-400 text-white font-bold rounded-lg shadow-lg m-2 py-2 px-2 w-52' onClick={submitPaymentMethod}>
        Enregistrer
      </button>
    </div>
  );
};

interface IStripe {
  onSubmit: (value: PaymentMethod) => void;
}

const StripeCard: React.FC<IStripe> = ({
  onSubmit
}) => {
  return (
    <Elements stripe={stripePromise}>
      <CardRegister onSubmit={onSubmit} />
    </Elements>
  );
};

export default StripeCard;