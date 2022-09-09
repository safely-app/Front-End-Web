import { render, act, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import Onboarding from './Onboarding';
import nock from "nock";

const baseURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

test('render Onboarding', async () => {
  const scopeProfessional = nock(baseURL).post("/professionalinfo")
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <Onboarding />
    </Provider>
  );

  expect(screen.getByText("Suivant")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Suivant"));

  expect(screen.getByPlaceholderText("Nom de l'entreprise")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Numéro de client TVA")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Téléphone personnel")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Téléphone d'entreprise")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Adresse d'entreprise")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Adresse d'entreprise 2 (facultatif)")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Adresse de facturation")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Type d'entreprise")).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText("Nom de l'entreprise"), { target: { value: "test" } });
  fireEvent.change(screen.getByPlaceholderText("Numéro de client TVA"), { target: { value: "1234567890123" } });
  fireEvent.change(screen.getByPlaceholderText("Téléphone personnel"), { target: { value: "0836757575" } });
  fireEvent.change(screen.getByPlaceholderText("Téléphone d'entreprise"), { target: { value: "0836757575" } });
  fireEvent.change(screen.getByPlaceholderText("Adresse d'entreprise"), { target: { value: "test" } });
  fireEvent.change(screen.getByPlaceholderText("Adresse d'entreprise 2 (facultatif)"), { target: { value: "test" } });
  fireEvent.change(screen.getByPlaceholderText("Adresse de facturation"), { target: { value: "test" } });
  fireEvent.change(screen.getByPlaceholderText("Type d'entreprise"), { target: { value: "test" } });

  expect(screen.getByText("Suivant")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Suivant"));

  await act(async () => await testDelay(1000));

  expect(screen.getByText("Suivant")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Suivant"));

  expect(screen.getByText("Suivant")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Suivant"));

  await act(async () => await testDelay(1000));

  scopeProfessional.done();
});