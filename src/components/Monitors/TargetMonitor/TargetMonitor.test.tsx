import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from "react-redux";
import { store } from '../../../redux';
import TargetMonitor from "./TargetMonitor";
import nock from 'nock';
import { TargetModal } from './TargetMonitorModal';
import ITarget from '../../interfaces/ITarget';

const baseURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

// TargetMonitor.tsx tests

test('render TargetMonitor', async () => {
  const scope = nock(baseURL).get('/commercial/target')
    .reply(200, [
      {
        _id: "t1",
        csp: "csp",
        name: "Target 1",
        ageRange: "20-30",
        interests: [ 'shoes' ],
        ownerId: "u1"
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <TargetMonitor />
    </Provider>
  );

  await act(async () => testDelay(1000));

  expect(screen.getByPlaceholderText('Rechercher une cible...')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Rechercher une cible...'), { target: { value: "t1" } });

  screen.getAllByText('Annuler').forEach(button => {
    fireEvent.click(button);
  });

  scope.done();
});

test('render TargetMonitor create modal', async () => {
  const scopeGet = nock(baseURL)
    .get('/commercial/target').reply(200, [], { 'Access-Control-Allow-Origin': '*' });
  const scopePost = nock(baseURL)
    .post('/commercial/target').reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <TargetMonitor />
    </Provider>
  );

  expect(screen.getByText('Créer une nouvelle cible')).toBeInTheDocument();

  fireEvent.change(screen.getAllByTestId("select")[0], { target: { value: "csp" } });
  fireEvent.change(screen.getAllByPlaceholderText("Nom")[0], { target: { value: "Cible 1" } });
  fireEvent.change(screen.getAllByPlaceholderText("Fourchette d'âge")[0], { target: { value: "40-50" } });
  fireEvent.change(screen.getAllByPlaceholderText("Ajouter un centre d'intérêt")[0], { target: { value: "shoes" } });

  fireEvent.click(screen.getByText('Créer une cible'));

  await act(async () => testDelay(1000));

  scopePost.done();
  scopeGet.done();
});

test('render TargetMonitor update modal', async () => {
  const scopeOptions = nock(baseURL).options('/commercial/target/t1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeUpdate = nock(baseURL).put('/commercial/target/t1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeGet = nock(baseURL)
    .get('/commercial/target').reply(200, [
      {
        _id: "t1",
        csp: "csp",
        name: "Target 1",
        ageRange: "20-30",
        interests: [ 'shoes' ],
        ownerId: "u1"
      }
    ], { 'Access-Control-Allow-Origin': '*' });


  render(
    <Provider store={store}>
      <TargetMonitor />
    </Provider>
  );

  await act(async () => testDelay(1000));

  expect(screen.getByTestId('ut-btn-11')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('ut-btn-11'));

  expect(screen.getByText('Modifier une cible')).toBeInTheDocument();

  fireEvent.change(screen.getAllByTestId("select")[1], { target: { value: "csp+" } });
  fireEvent.change(screen.getAllByPlaceholderText("Nom")[1], { target: { value: "Cible 1" } });
  fireEvent.change(screen.getAllByPlaceholderText("Fourchette d'âge")[1], { target: { value: "40-50" } });
  fireEvent.change(screen.getAllByPlaceholderText("Ajouter un centre d'intérêt")[1], { target: { value: "basketball" } });

  fireEvent.click(screen.getByText('Modifier la cible'));

  await act(async () => testDelay(1000));

  scopeOptions.done();
  scopeUpdate.done();
  scopeGet.done();
});

test('render TargetMonitor delete target', async () => {
  const scopeOptions = nock(baseURL).options('/commercial/target/t1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeDelete = nock(baseURL).delete('/commercial/target/t1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeGet = nock(baseURL)
    .get('/commercial/target').reply(200, [
      {
        _id: "t1",
        csp: "csp",
        name: "Target 1",
        ageRange: "20-30",
        interests: [ 'shoes' ],
        ownerId: "u1"
      }
    ], { 'Access-Control-Allow-Origin': '*' });


  render(
    <Provider store={store}>
      <TargetMonitor />
    </Provider>
  );

  await act(async () => testDelay(1000));

  expect(screen.getByTestId('dt-btn-11')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('dt-btn-11'));

  await act(async () => testDelay(1000));

  scopeOptions.done();
  scopeDelete.done();
  scopeGet.done();
});



// TargetMonitorModal.tsx test

test('render TargetMonitorModal', () => {
  const setTarget = jest.fn();
  const target: ITarget = {
    id: "t1",
    ownerId: "u1",
    name: "Cible 1",
    csp: "csp",
    interests: [ "shoes" ],
    ageRange: "40-50",
  };

  render(
    <TargetModal
      title=''
      modalOn={true}
      target={target}
      setTarget={setTarget}
      buttons={[]}
    />
  );

  fireEvent.change(screen.getByRole("combobox"), { target: { value: "csp-" } });
  fireEvent.change(screen.getByPlaceholderText("Nom"), { target: { value: "Cible 2" } });
  fireEvent.change(screen.getByPlaceholderText("Fourchette d'âge"), { target: { value: "40-60" } });
  fireEvent.change(screen.getByPlaceholderText("Ajouter un centre d'intérêt"), { target: { value: "basketball" } });
  fireEvent.keyPress(screen.getByPlaceholderText("Ajouter un centre d'intérêt"), { key: 'Enter', charCode: 13 });
  fireEvent.click(screen.getByTestId('dti-btn-0'));

  expect(setTarget).toBeCalledTimes(5);
});