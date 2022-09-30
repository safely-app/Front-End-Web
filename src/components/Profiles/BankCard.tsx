import React from 'react';
import { IStripeCard } from '../interfaces/IStripe';

const Expiry: React.FC = (props) => {
  return (
    <div className='ml-2.5' {...props} />
  );
};

const Line: React.FC = (props) => {
  return (
    <div className='flex w-full items-center justify-between' {...props} />
  );
};

const Field: React.FC = (props) => {
  return (
    <div className='inline-block whitespace-nowrap overflow-hidden' style={{
      color: "rgba(255, 255, 255, 0.5)",
      fontFamily: "Courier, monospace",
      border: "3px solid transparent",
    }} {...props} />
  );
};

const NumberField: React.FC = (props) => {
  return (
    <div className='whitespace-nowrap overflow-hidden w-full my-2' style={{
      color: "rgba(255, 255, 255, 0.5)",
      fontFamily: "Courier, monospace",
      border: "3px solid transparent",
      fontSize: "1.5rem",
    }} {...props} />
  );
};

const CbLogo: React.FC = () => {
  return (
    <div className='flex rounded justify-center items-center h-9 px-1' style={{
      background: "linear-gradient(to bottom, #23356a 0%, #4a91cc 35%, #4a91cc 65%, #38765e 100%)",
    }}>
      <svg className='h-5 fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 159 66">
        <path d="M159 16c0-8.6-7-15.7-15.7-15.7H86v31.5h57.3c8.7 0 15.7-7 15.7-15.7zm0 33.5c0-8.7-7-15.7-15.7-15.8H86v31.6h57.3c8.7 0 15.7-7 15.7-15.8zM42.8 33.7v-2h42v-2.5C84.8 13.4 72 .5 56.2.5H29.5C13.5.5.8 13.5.8 29.2v7.6c0 15.8 12.8 28.7 28.7 28.7h26.7C72 65.5 85 52.5 85 36.8v-3H42.6z" />
      </svg>
    </div>
  );
};

const MastercardLogo: React.FC = () => {
  return (
    <div className='relative text-white font-bold text-center italic leading-9' style={{
      fontSize: ".5625rem",
      textShadow: "1px 1px rgba(0, 0, 0, 0.6)",
      padding: "0 5px",
    }}>
      <div className='absolute w-9 h-9 rounded-full z-0 content-none left-0' style={{ background: "#f00" }} />
      <div className='absolute w-9 h-9 rounded-full z-0 content-none right-0' style={{ background: "#ffab00" }} />
      <span className='relative z-0'>Mastercard</span>
    </div>
  );
};

const VisaLogo: React.FC = () => {
  return (
    <div className='relative bg-white uppercase font-bold text-center italic leading-9' style={{
      color: "#1a1876",
      fontSize: ".9375rem",
      boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.3)",
      padding: "0 5px",
    }}>
      <div className='absolute content-none left-0 right-0 h-1/4 z-0 top-0' style={{ background: "#1a1876" }} />
      <div className='absolute content-none left-0 right-0 h-1/4 z-0 bottom-0' style={{ background: "#e79800" }} />
      <span>Visa</span>
    </div>
  );
};

const Logo: React.FC<{
  brand: string;
}> = ({
  brand
}) => {
  if (brand === "visa") return <VisaLogo />;
  if (brand === "mastercard") return <MastercardLogo />;
  if (brand === "cartes_bancaires") return <CbLogo />;
  return <></>;
};

const BankCard: React.FC<{
  stripeCard: IStripeCard;
  name: string;
  isDefault?: boolean;
}> = ({
  stripeCard,
  name,
  isDefault
}) => {
  const spacedNumber = ('••••••••••••' + stripeCard.last4).replace(/(.{4})/g, "$1 ");
  const cardColorId = stripeCard.id.split('').reduce((counter, c) => counter + c.charCodeAt(0), 0);

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  const r1 = cardColorId * 3 % 200;
  const g1 = cardColorId * 5 % 200;
  const b1 = cardColorId * 8 % 200;
  const r2 = r1 + 150 % 200;
  const g2 = g1 + 150 % 200;
  const b2 = b1 + 150 % 200;

  const expYear =
    (stripeCard.expYear === undefined) ? ""
      : (stripeCard.expYear % 100).toString();

  const expMonth =
    (stripeCard.expMonth === undefined) ? ""
      : (stripeCard.expMonth < 10 ? '0' + stripeCard.expMonth : stripeCard.expMonth.toString());

  return (
    <div className='relative w-full h-52 rounded-lg flex flex-col justify-between p-6 overflow-hidden' style={{
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
      backgroundImage: `linear-gradient(125deg, ${rgbToHex(r1, g1, b1)} 0%, ${rgbToHex(r2, g2, b2)} 100%)`
    }}>
      <div
        className='absolute z-10 bg-green-600 top-8 left-8 -rotate-45 py-1 px-5 text-xs text-white -translate-x-1/2 -translate-y-1/2'
        hidden={!isDefault}
      >Carte principal</div>
      <Line>
        <div className='relative rounded-md h-9' style={{ background: "#c1c2c4", width: "3.125rem" }} />
        <Logo brand={stripeCard.brand} />
      </Line>
      <Line>
        <NumberField>
          {spacedNumber}
        </NumberField>
      </Line>
      <Line>
        <Field>{name}</Field>
        <Expiry>
          <Field>{expMonth}</Field>
          <Field>{expYear}</Field>
        </Expiry>
      </Line>
    </div>
  );
};

export default BankCard;