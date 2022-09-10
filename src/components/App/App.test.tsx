import { act, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import App from './App';
import nock from 'nock';

const baseURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

test('renders app', async () => {
  const scopeUser = nock(baseURL).get('/user/')
    .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeSafeplace = nock(baseURL).get('/safeplace/safeplace')
    .reply(200, [
      {
        _id: "s1",
        type: "resto",
        city: "ville",
        name: "safeplace",
        address: "adresse",
        coordinate: [ "1", "1" ],
        dayTimetable: [ null, null, null, null, null, null, null ]
      }
    ], { 'Access-Control-Allow-Origin': '*' });
  // const scopeNotif = nock("https://api.safely-app.fr").get('/commercial/notifications')
  //   .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  await act(async () => testDelay(2000));

  scopeSafeplace.done();
  // scopeNotif.done();
  scopeUser.done();
});

// test('renders map', () => {
//   const safeplaces: ISafeplace[] = [
//     {
//       id: "1",
//       name: "Magasin stylé",
//       city: "Paris",
//       address: "12 Avenue de la Poiscaille",
//       type: "Top",
//       dayTimetable: [],
//       coordinate: [ "48.92", "35.61" ]
//     }
//   ];

//   render(
//     <Map safeplaces={safeplaces} />
//   );
// });