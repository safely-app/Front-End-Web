import { act, fireEvent, render, screen } from '@testing-library/react';
import { SafeplacesList } from './Safeplaces';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import nock from 'nock';

const testURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('renders SafeplacesList', () => {
  const safeplaces = [
    {
      id: "1",
      name: "name",
      description: "description",
      city: "city",
      address: "address",
      type: "type",
      dayTimetable: [ null, null, null, null, null, null, null ],
      coordinate: [ "48", "-56" ],
    }
  ];

  render(
    <Provider store={store}>
      <SafeplacesList
        safeplaces={{ setter: () => {}, value: safeplaces }}
        comments={[]}
      />
    </Provider>
  );

  expect(screen.getByText("name")).toBeInTheDocument();
  expect(screen.getByText("type")).toBeInTheDocument();
});

test('SafeplacesList claim safeplace', async () => {
  const safeplaces = [
    {
      id: "s1",
      name: "Safeplace name",
      description: "test",
      city: "test",
      address: "test address",
      type: "test",
      dayTimetable: [ null, null, null, null, null, null, null ],
      coordinate: [ "48", "-56" ],
    }
  ];

  const scopeClaim = nock(testURL)
    .post('/safeplace/requestClaimSafeplace')
    .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplacesList
        safeplaces={{ setter: () => {}, value: safeplaces }}
        comments={[]}
      />
    </Provider>
  );

  expect(screen.getByTestId("safeplace-get-detail-s1")).toBeInTheDocument();
  fireEvent.click(screen.getByTestId("safeplace-get-detail-s1"));

  expect(screen.getByText('Réclamer ce commerce')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Réclamer ce commerce'));

  await act(async () => await testDelay(1000));

  scopeClaim.done();
});

test('SafeplacesList update info', async () => {
  const safeplaces = [
    {
      id: "s1",
      name: "test",
      description: "test",
      city: "test",
      address: "test address",
      type: "test",
      dayTimetable: [ null, null, null, null, null, null, null ],
      coordinate: [ "48", "-56" ],
    }
  ];

  const scopeCreate = nock(testURL).post('/commercial/modif')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplacesList
        safeplaces={{ setter: () => {}, value: safeplaces }}
        comments={[]}
      />
    </Provider>
  );

  expect(screen.getByTestId("safeplace-update-s1")).toBeInTheDocument();
  fireEvent.click(screen.getByTestId("safeplace-update-s1"));

  expect(screen.getByPlaceholderText("Nom")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Ville")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Adresse")).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText("Nom"), { target: { value: "Safeplace 1" } });
  fireEvent.change(screen.getByPlaceholderText("Ville"), { target: { value: "Ville 1" } });
  fireEvent.change(screen.getByPlaceholderText("Adresse"), { target: { value: "Adresse 1" } });

  expect(screen.getByText('Modifier le commerce')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Modifier le commerce'));

  await act(async () => await testDelay(1000));

  scopeCreate.done();
});

test('SafeplacesList remove safeplace', async () => {
  const safeplaces = [
    {
      id: "s1",
      name: "test",
      description: "test",
      city: "test",
      address: "test address",
      type: "test",
      dayTimetable: [ null, null, null, null, null, null, null ],
      coordinate: [ "48", "-56" ],
    }
  ];

  const scopeOptions = nock(testURL).options('/safeplace/safeplace/s1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeDelete = nock(testURL).delete('/safeplace/safeplace/s1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplacesList
        safeplaces={{ setter: () => {}, value: safeplaces }}
        comments={[]}
      />
    </Provider>
  );

  expect(screen.getByTestId("safeplace-update-s1")).toBeInTheDocument();
  fireEvent.click(screen.getByTestId("safeplace-update-s1"));

  expect(screen.getByText('Supprimer')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Supprimer'));

  await act(async () => await testDelay(1000));

  scopeOptions.done();
  scopeDelete.done();
});

// test('SafeplacesList archive safeplace', async () => {
//   const safeplaces = [
//     {
//       id: "s1",
//       name: "test",
//       description: "test",
//       city: "test",
//       address: "test address",
//       type: "test",
//       dayTimetable: [ null, null, null, null, null, null, null ],
//       coordinate: [ "48", "-56" ],
//     }
//   ];

//   const scopeOptions = nock(testURL).options('/safeplace/safeplace/s1')
//     .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
//   const scopeDelete = nock(testURL).delete('/safeplace/safeplace/s1')
//     .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

//   render(
//     <Provider store={store}>
//       <SafeplacesList
//         safeplaces={{ setter: () => {}, value: safeplaces }}
//         comments={[]}
//       />
//     </Provider>
//   );

//   expect(screen.getByText("Modifier")).toBeInTheDocument();
//   fireEvent.click(screen.getByText("Modifier"));

//   expect(screen.getByText('Archiver le commerce')).toBeInTheDocument();
//   fireEvent.click(screen.getByText('Archiver le commerce'));

//   await act(async () => await testDelay(1000));

//   scopeOptions.done();
//   scopeDelete.done();
// });

// test('render Safeplaces', async () => {
//   const scopeGet = nock(testURL).get('/safeplace/safeplace')
//     .reply(200, [
//       {
//         _id: "s1",
//         name: "test",
//         description: "test",
//         city: "test",
//         address: "test address",
//         type: "test",
//         dayTimetable: [ null, null, null, null, null, null, null ],
//         coordinate: [ "48", "-56" ],
//       }
//     ], { 'Access-Control-Allow-Origin': '*' });


//   render(
//     <Provider store={store}>
//       <Safeplaces />
//     </Provider>
//   );

//   await act(async () => testDelay(1000));

//   scopeGet.done();
// });