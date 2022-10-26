import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import UserMonitor from './UserMonitor';
import nock from 'nock';

const baseURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

test('renders user monitor', async () => {
  const scope = nock(baseURL)
    .get('/user').reply(200, [
      {
        _id: "u1",
        username: "Billy",
        email: "billy@lesinge",
        password: "billylesinge",
        role: "admin"
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <UserMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByPlaceholderText('Rechercher un utilisateur...')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Rechercher un utilisateur...'), { target: { value: "u1" } });

  screen.getAllByText('Annuler').forEach(button => {
    fireEvent.click(button);
  });

  scope.done();
});

test('ensure that invalid input does not crash the user filtering', async () => {
  const scope = nock(baseURL)
    .get('/user')
    .reply(200, [
      {
        _id: "1",
        username: "Billy",
        email: "billy@lesinge",
        password: "billylesinge",
        role: "admin"
      }
    ], {
      'Access-Control-Allow-Origin': '*'
    });

  render(
    <Provider store={store}>
      <UserMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByPlaceholderText('Rechercher un utilisateur...')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Rechercher un utilisateur...'), { target: { value: "eujffeojwefokfewkpo[" } });

  expect(screen.getByDisplayValue('eujffeojwefokfewkpo[')).toBeInTheDocument();

  scope.done();
});

test('render UserMonitor update modal', async () => {
  const scopeUpdate = nock(baseURL).put('/user/u1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(baseURL).options('/user/u1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeGet = nock(baseURL).get('/user')
    .reply(200, [
      {
        _id: "u1",
        username: "Billy",
        email: "billy@lesinge",
        password: "billylesinge",
        role: "admin"
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <UserMonitor />
    </Provider>
  );

  await act(async () => testDelay(1000));

  expect(screen.getByTestId('uu-btn-9')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('uu-btn-9'));

  expect(screen.getByText("Modifier un utilisateur")).toBeInTheDocument();

  expect(screen.getByText('Billy')).toBeInTheDocument();
  expect(screen.getByText('billy@lesinge')).toBeInTheDocument();
  expect(screen.getByText('admin')).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: "User 1" } });
  fireEvent.change(screen.getByPlaceholderText('Adresse e-mail'), { target: { value: "a@b.fr" } });
  fireEvent.change(screen.getByPlaceholderText('Rôle'), { target: { value: "user" } });

  fireEvent.click(screen.getByText("Modifier l'utilisateur"));

  await act(async () => testDelay(1000));

  scopeOptions.done();
  scopeUpdate.done();
  scopeGet.done();
});

test('render UserMonitor delete user', async () => {
  const scopeDelete = nock(baseURL).delete('/user/u1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(baseURL).options('/user/u1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeGet = nock(baseURL).get('/user')
    .reply(200, [
      {
        _id: "u1",
        username: "Billy",
        email: "billy@lesinge",
        password: "billylesinge",
        role: "admin"
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <UserMonitor />
    </Provider>
  );

  await act(async () => testDelay(1000));

  expect(screen.getByTestId('du-btn-9')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('du-btn-9'));

  await act(async () => testDelay(1000));

  scopeOptions.done();
  scopeDelete.done();
  scopeGet.done();
});