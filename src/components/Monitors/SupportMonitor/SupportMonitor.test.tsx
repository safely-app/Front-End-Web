import { render, screen, act, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import { store } from '../../../redux';
import IReport from "../../interfaces/IReport";
import SupportMonitor from "./SupportMonitor";
import nock from "nock";

const testUrl = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

test('render SupportMonitor', async () => {
  const scopeSupport = nock(testUrl)
    .get('/support/support')
    .reply(200, [
      {
        id: "s1",
        _id: "s1",
        type: "bug",
        userId: "1",
        title: "Titre",
        comment: "Commentaire",
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SupportMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByPlaceholderText("Rechercher un rapport...")).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText("Rechercher un rapport..."), { target: { value: "s1" } });

  screen.getAllByText('Annuler').forEach(button => {
    fireEvent.click(button);
  });

  scopeSupport.done();
});

test('render SupportMonitor update modal', async () => {
  const supports: IReport[] = [
    {
      id: "s1",
      type: "bug",
      userId: "1",
      title: "Titre",
      comment: "Commentaire",
    }
  ];

  const finalSupports = supports.map(support => ({
    ...support,
    _id: support.id,
  }));

  const scopeGet = nock(testUrl).get('/support/support')
    .reply(200, finalSupports, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(testUrl).options('/support/support/s1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeUpdate = nock(testUrl).put('/support/support/s1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SupportMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByTestId('us-btn-11')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('us-btn-11'));

  expect(screen.getByText('Modifier un rapport')).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText("Type"), { target: { value: "Type" } });
  fireEvent.change(screen.getByPlaceholderText("Titre"), { target: { value: "Title" } });
  fireEvent.change(screen.getByPlaceholderText("Commentaire"), { target: { value: "Comment" } });
  fireEvent.change(screen.getByPlaceholderText("ID de propriétaire"), { target: { value: "2" } });

  fireEvent.click(screen.getByText('Modifier le rapport'));

  await act(async () => await testDelay(1000));

  scopeOptions.done();
  scopeUpdate.done();
  scopeGet.done();
});

test('render SupportMonitor delete support', async () => {
  const supports: IReport[] = [
    {
      id: "s1",
      type: "bug",
      userId: "1",
      title: "Titre",
      comment: "Commentaire",
    }
  ];

  const finalSupports = supports.map(support => ({
    ...support,
    _id: support.id,
  }));

  const scopeGet = nock(testUrl).get('/support/support')
    .reply(200, finalSupports, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(testUrl).options('/support/support/s1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeDelete = nock(testUrl).delete('/support/support/s1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SupportMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByTestId('ds-btn-11')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('ds-btn-11'));

  await act(async () => await testDelay(1000));

  scopeOptions.done();
  scopeDelete.done();
  scopeGet.done();
});