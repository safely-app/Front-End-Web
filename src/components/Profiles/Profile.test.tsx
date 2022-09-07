import { render, act, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import Profile from './Profile';
import nock from 'nock';
import BankCard from './BankCard';
import { IStripeCard } from '../interfaces/IStripe';

const baseURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

test('render Profile', async () => {
  const scopeUser = nock(baseURL).get('/user/')
    .reply(200, {
      _id: "u1",
      username: "User 1",
      email: "user1@cool.fr",
      role: "user",
      stripeId: "stripe1"
    }, { 'Access-Control-Allow-Origin': '*' });

  const scopeProfessional = nock(baseURL).get('/professionalinfo/owner/')
    .reply(200, {
      _id: "p1",
      userId: "u1",
      companyName: "Company 1",
      companyAddress: "1 Rue de la Companie",
      companyAddress2: "2 Rue du Campanile",
      billingAddress: "1 Rue de la Companie",
      clientNumberTVA: "1234567890123",
      personalPhone: "0836656565",
      companyPhone: "0836656565",
      RCS: "",
      registrationCity: "Biaritz",
      SIREN: "123456789",
      SIRET: "12345123456789",
      artisanNumber: "",
      type: "restosushi"
    }, { 'Access-Control-Allow-Origin': '*' });

  const scopeStripeCards = nock(baseURL).get('/stripe/stripe/user/card/undefined')
    .reply(200, {
      data: [
        {
          id: "ps1",
          created: 1,
          customerId: "User 1",
          card: {
            brand: "visa",
            country: "FR",
            expMonth: 9,
            expYear: 2022,
            last4: "0987",
          },
        }
      ]
    }, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <Profile />
    </Provider>
  );

  await act(async () => testDelay(1000));

  expect(screen.getByTestId("div-Informations personnelles")).toBeInTheDocument();
  expect(screen.getByTestId("div-Informations de votre entreprise")).toBeInTheDocument();
  expect(screen.getByTestId("div-Solutions de paiement")).toBeInTheDocument();

  fireEvent.click(screen.getByTestId("div-Informations personnelles"));
  fireEvent.click(screen.getByTestId("div-Informations personnelles"));
  fireEvent.click(screen.getByTestId("div-Informations de votre entreprise"));
  fireEvent.click(screen.getByTestId("div-Informations de votre entreprise"));
  fireEvent.click(screen.getByTestId("div-Solutions de paiement"));
  fireEvent.click(screen.getByTestId("div-Solutions de paiement"));

  scopeProfessional.done();
  scopeStripeCards.done();
  scopeUser.done();
});

test('render Profile update user', async () => {
  const scopeUserOptions = nock(baseURL).options('/user/u1')
  .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeUserUpdate = nock(baseURL).put('/user/u1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeUser = nock(baseURL).get('/user/')
    .reply(200, {
      _id: "u1",
      username: "User 1",
      email: "user1@cool.fr",
      role: "user",
      stripeId: "stripe1"
    }, { 'Access-Control-Allow-Origin': '*' });

  const scopeProfessional = nock(baseURL).get('/professionalinfo/owner/')
    .reply(200, {
      _id: "p1",
      userId: "u1",
      companyName: "Company 1",
      companyAddress: "1 Rue de la Companie",
      companyAddress2: "2 Rue du Campanile",
      billingAddress: "1 Rue de la Companie",
      clientNumberTVA: "1234567890123",
      personalPhone: "0836656565",
      companyPhone: "0836656565",
      RCS: "",
      registrationCity: "Biaritz",
      SIREN: "123456789",
      SIRET: "12345123456789",
      artisanNumber: "",
      type: "restosushi"
    }, { 'Access-Control-Allow-Origin': '*' });

  const scopeStripeCards = nock(baseURL).get('/stripe/stripe/user/card/undefined')
    .reply(200, { data: [] }, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <Profile />
    </Provider>
  );

  await act(async () => testDelay(1000));

  expect(screen.getByDisplayValue("User 1")).toBeInTheDocument();
  expect(screen.getByDisplayValue("user1@cool.fr")).toBeInTheDocument();

  fireEvent.change(screen.getByDisplayValue("User 1"), { target: { value: "User 2" } });
  fireEvent.change(screen.getByDisplayValue("user1@cool.fr"), { target: { value: "a@b.fr" } });

  fireEvent.click(screen.getByTestId("section-btn-Informations personnelles-0"));

  await act(async () => testDelay(1000));

  scopeProfessional.done();
  scopeStripeCards.done();
  scopeUserOptions.done();
  scopeUserUpdate.done();
  scopeUser.done();
});

test('render Profile update professional info', async () => {
  const scopeUser = nock(baseURL).get('/user/')
    .reply(200, {
      _id: "u1",
      username: "User 1",
      email: "user1@cool.fr",
      role: "user",
      stripeId: "stripe1"
    }, { 'Access-Control-Allow-Origin': '*' });

  const scopeProfessionalOptions = nock(baseURL).options('/professionalinfo/p1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeProfessionalUpdate = nock(baseURL).put('/professionalinfo/p1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeProfessional = nock(baseURL).get('/professionalinfo/owner/')
    .reply(200, {
      _id: "p1",
      userId: "u1",
      companyName: "Company 1",
      companyAddress: "1 Rue de la Companie",
      companyAddress2: "2 Rue du Campanile",
      billingAddress: "1 Rue de la Companie",
      clientNumberTVA: "1234567890123",
      personalPhone: "0836656565",
      companyPhone: "0836656565",
      RCS: "",
      registrationCity: "Biaritz",
      SIREN: "123456789",
      SIRET: "12345123456789",
      artisanNumber: "",
      type: "restosushi"
    }, { 'Access-Control-Allow-Origin': '*' });

  const scopeStripeCards = nock(baseURL).get('/stripe/stripe/user/card/undefined')
    .reply(200, { data: [] }, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <Profile />
    </Provider>
  );

  await act(async () => testDelay(1000));

  expect(screen.getByPlaceholderText("Nom de l'entreprise")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Adresse de l'entreprise")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Adresse de l'entreprise 2")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Adresse de facturation")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Numéro de client TVA")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Numéro de télephone personnel")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Numéro de télephone professionel")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Type d'entreprise")).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText("Nom de l'entreprise"), { target: { value: "Nom" } });
  fireEvent.change(screen.getByPlaceholderText("Adresse de l'entreprise"), { target: { value: "Adresse1" } });
  fireEvent.change(screen.getByPlaceholderText("Adresse de l'entreprise 2"), { target: { value: "Adresse2" } });
  fireEvent.change(screen.getByPlaceholderText("Adresse de facturation"), { target: { value: "Adresse" } });
  fireEvent.change(screen.getByPlaceholderText("Numéro de client TVA"), { target: { value: "0987654321098" } });
  fireEvent.change(screen.getByPlaceholderText("Numéro de télephone personnel"), { target: { value: "1111111111" } });
  fireEvent.change(screen.getByPlaceholderText("Numéro de télephone professionel"), { target: { value: "1111111111" } });
  fireEvent.change(screen.getByPlaceholderText("Type d'entreprise"), { target: { value: "restoincr" } });

  fireEvent.click(screen.getByTestId("section-btn-Informations de votre entreprise-0"));

  await act(async () => testDelay(1000));

  scopeProfessionalOptions.done();
  scopeProfessionalUpdate.done();
  scopeProfessional.done();
  scopeStripeCards.done();
  scopeUser.done();
});

// test('render Profile delete user', async () => {
//   const scopeUserOptions = nock(baseURL).options('/user/u1')
//   .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
//   const scopeUserDelete = nock(baseURL).delete('/user/u1')
//     .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
//   const scopeUser = nock(baseURL).get('/user/')
//     .reply(200, {
//       _id: "u1",
//       username: "User 1",
//       email: "user1@cool.fr",
//       role: "user",
//       stripeId: "stripe1"
//     }, { 'Access-Control-Allow-Origin': '*' });

//   const scopeProfessionalOptions = nock(baseURL).options('/professionalinfo/p1')
//     .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
//   const scopeProfessionalDelete = nock(baseURL).delete('/professionalinfo/p1')
//     .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
//   const scopeProfessional = nock(baseURL).get('/professionalinfo/owner/')
//     .reply(200, {
//       _id: "p1",
//       userId: "u1",
//       companyName: "Company 1",
//       companyAddress: "1 Rue de la Companie",
//       companyAddress2: "2 Rue du Campanile",
//       billingAddress: "1 Rue de la Companie",
//       clientNumberTVA: "1234567890123",
//       personalPhone: "0836656565",
//       companyPhone: "0836656565",
//       RCS: "",
//       registrationCity: "Biaritz",
//       SIREN: "123456789",
//       SIRET: "12345123456789",
//       artisanNumber: "",
//       type: "restosushi"
//     }, { 'Access-Control-Allow-Origin': '*' });

//   const scopeStripeCards = nock(baseURL).get('/stripe/stripe/user/card/undefined')
//     .reply(200, { data: [] }, { 'Access-Control-Allow-Origin': '*' });

//   render(
//     <Provider store={store}>
//       <Profile />
//     </Provider>
//   );

//   await act(async () => testDelay(1000));

//   expect(screen.getByText("Supprimer mon compte")).toBeInTheDocument();
//   fireEvent.click(screen.getByText("Supprimer mon compte"));

//   await act(async () => testDelay(1000));

//   scopeProfessionalOptions.done();
//   scopeProfessionalDelete.done();
//   scopeProfessional.done();
//   scopeStripeCards.done();
//   scopeUserOptions.done();
//   scopeUserDelete.done();
//   scopeUser.done();
// });

// test('render Profile link card', async () => {
//   const scopeUserOptions = nock(baseURL).options('/user/u1')
//    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
//   const scopeUserUpdate = nock(baseURL).put('/user/u1')
//     .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
//   const scopeUser = nock(baseURL).get('/user/')
//     .reply(200, {
//       _id: "u1",
//       username: "User 1",
//       email: "user1@cool.fr",
//       role: "user",
//     }, { 'Access-Control-Allow-Origin': '*' });

//   const scopeProfessional = nock(baseURL).get('/professionalinfo/owner/')
//     .reply(200, {
//       _id: "p1",
//       userId: "u1",
//       companyName: "Company 1",
//       companyAddress: "1 Rue de la Companie",
//       companyAddress2: "2 Rue du Campanile",
//       billingAddress: "1 Rue de la Companie",
//       clientNumberTVA: "1234567890123",
//       personalPhone: "0836656565",
//       companyPhone: "0836656565",
//       RCS: "",
//       registrationCity: "Biaritz",
//       SIREN: "123456789",
//       SIRET: "12345123456789",
//       artisanNumber: "",
//       type: "restosushi"
//     }, { 'Access-Control-Allow-Origin': '*' });

//   const scopeStripeAddCard = nock(baseURL).post('/stripe/stripe/cardLink')
//     .reply(200, {
//       id: "ps1",
//       created: 1,
//       customerId: "User 1",
//       card: {
//         brand: "visa",
//         country: "FR",
//         expMonth: 9,
//         expYear: 2022,
//         last4: "0987",
//       },
//     }, { 'Access-Control-Allow-Origin': '*' });
//   const scopeStripeCards = nock(baseURL).get('/stripe/stripe/user/card/undefined')
//     .reply(200, { data: [] }, { 'Access-Control-Allow-Origin': '*' });

//   render(
//     <Provider store={store}>
//       <Profile />
//     </Provider>
//   );

//   await act(async () => await testDelay(1000));

//   expect(screen.getByTestId("div-Solutions de paiement")).toBeInTheDocument();
//   fireEvent.click(screen.getByTestId("div-Solutions de paiement"));

//   expect(screen.getByText("Ajouter une carte")).toBeInTheDocument();
//   fireEvent.click(screen.getByText("Ajouter une carte"));

//   expect(screen.getByPlaceholderText("Card number")).toBeInTheDocument();
//   expect(screen.getByPlaceholderText("MM / YY")).toBeInTheDocument();
//   expect(screen.getByPlaceholderText("CVC")).toBeInTheDocument();
//   expect(screen.getByPlaceholderText("ZIP")).toBeInTheDocument();

//   fireEvent.change(screen.getByPlaceholderText("Card number"), { target: { value: "4242424242424242" } });
//   fireEvent.change(screen.getByPlaceholderText("MM / YY"), { target: { value: "04 / 42" } });
//   fireEvent.change(screen.getByPlaceholderText("CVC"), { target: { value: "424" } });
//   fireEvent.change(screen.getByPlaceholderText("ZIP"), { target: { value: "42400" } });

//   expect(screen.getByText("Enregistrer")).toBeInTheDocument();
//   fireEvent.click(screen.getByText("Enregistrer"));

//   await act(async () => await testDelay(1000));

//   scopeStripeAddCard.done();
//   scopeProfessional.done();
//   scopeStripeCards.done();
//   scopeUserOptions.done();
//   scopeUserUpdate.done();
//   scopeUser.done();
// });

test('render BankCard', () => {
  const stripeCard: IStripeCard = {
    id: "ps1",
    created: "1000",
    customerId: "User 1",
    brand: "",
    country: "FR",
    expMonth: 9,
    expYear: 2022,
    last4: "0987",
  };

  render(
    <BankCard
      name="Billy"
      stripeCard={stripeCard}
    />
  );
});

test('render BankCard visa', () => {
  const stripeCard: IStripeCard = {
    id: "ps1",
    created: "1000",
    customerId: "User 1",
    brand: "visa",
    country: "FR",
    expMonth: 9,
    expYear: 2022,
    last4: "0987",
  };

  render(
    <BankCard
      name="Billy"
      stripeCard={stripeCard}
    />
  );
});

test('render BankCard mastercard', () => {
  const stripeCard: IStripeCard = {
    id: "ps1",
    created: "1000",
    customerId: "User 1",
    brand: "mastercard",
    country: "FR",
    expMonth: 9,
    expYear: 2022,
    last4: "0987",
  };

  render(
    <BankCard
      name="Billy"
      stripeCard={stripeCard}
    />
  );
});

test('render BankCard cartes_bancaires', () => {
  const stripeCard: IStripeCard = {
    id: "ps1",
    created: "1000",
    customerId: "User 1",
    brand: "cartes_bancaires",
    country: "FR",
    expMonth: 9,
    expYear: 2022,
    last4: "0987",
  };

  render(
    <BankCard
      name="Billy"
      stripeCard={stripeCard}
    />
  );
});