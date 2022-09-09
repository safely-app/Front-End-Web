import { render, act, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import BugReport from './BugReport';
import nock from 'nock';

const baseURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

test('render BugReport', async () => {
  const scope = nock(baseURL).post('/support/support')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <BugReport />
    </Provider>
  );

  expect(screen.getByPlaceholderText("Titre")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Votre commentaire...")).toBeInTheDocument();
  expect(screen.getByText("Envoyer")).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText("Titre"), { target: { value: "Titre" } });
  fireEvent.change(screen.getByPlaceholderText("Votre commentaire..."), { target: { value: "Comment" } });
  fireEvent.click(screen.getByText("Envoyer"));

  await act(async () => testDelay(1000));

  scope.done();
});