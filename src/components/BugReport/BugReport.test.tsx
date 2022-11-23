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

  const titleElement = screen.getByPlaceholderText("Titre de votre requête");
  const commentElement = screen.getByPlaceholderText("Décrivez-nous votre avis");

  expect(titleElement).toBeInTheDocument();
  expect(commentElement).toBeInTheDocument();
  expect(screen.getByText("Envoyer")).toBeInTheDocument();

  fireEvent.change(titleElement, { target: { value: "Titre" } });
  fireEvent.change(commentElement, { target: { value: "Comment" } });
  fireEvent.click(screen.getByText("Envoyer"));

  await act(async () => testDelay(1000));

  scope.done();
});