import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import ISafeplace from '../interfaces/ISafeplace';
import SafeplaceSingle, {
  SafeplaceSingleInfo,
  SafeplaceTimetable,
  SafeplaceTimetableDay,
  splitValue,
  TimeInput
} from './Safeplace';
import nock from 'nock';

const testURL = process.env.REACT_APP_SERVER_URL as "";

const testDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

test('render non-existing safeplacesingle', async () => {
  const scope = nock(testURL).get('/safeplace/safeplace/undefined')
    .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplaceSingle />
    </Provider>
  );

  await act(async () => await testDelay(1000));
  scope.done();
});

test('render SafeplaceSingleInfo', async () => {
  const safeplace: ISafeplace = {
    id: "s1",
    name: "Nom",
    description: "Description",
    city: "Ville",
    address: "Adresse",
    type: "resto",
    dayTimetable: [ null, null, null, null, null, null, null ],
    coordinate: [ "1", "1" ],
    ownerId: "u1",
  };

  const scope = nock(testURL).post('/commercial/modif')
    .reply(200, { message: 'Success' }, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplaceSingleInfo safeplace={safeplace} />
    </Provider>
  );

  expect(screen.getByText("Modifier")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Modifier"));

  expect(screen.getByPlaceholderText("Nom")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Ville")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Adresse")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Type")).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText("Nom"), { target: { value: "Safeplace" } });
  fireEvent.change(screen.getByPlaceholderText("Description"), { target: { value: "C'est la safeplace" } });
  fireEvent.change(screen.getByPlaceholderText("Ville"), { target: { value: "Angouleme" } });
  fireEvent.change(screen.getByPlaceholderText("Adresse"), { target: { value: "1 Rue de l'adresse" } });
  fireEvent.change(screen.getByPlaceholderText("Type"), { target: { value: "restokuizin" } });

  expect(screen.getByText("Valider")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Valider"));

  await act(async () => await testDelay(1000));

  scope.done();
});

test('render SafeplaceTimetable', () => {
  const setSafeplace = jest.fn();
  const safeplace = {
    id: "1",
    ownerId: "1",
    name: "test",
    city: "test",
    type: "test",
    address: "test",
    description: "test",
    coordinate: [ "1", "1" ],
    dayTimetable: [
      "01h23 à 02h34,03h45 à 04h56",
      "01h23 à 02h34,03h45 à 04h56",
      "01h23 à 02h34,03h45 à 04h56",
      "01h23 à 02h34,03h45 à 04h56",
      "01h23 à 02h34,03h45 à 04h56",
      "01h23 à 02h34,03h45 à 04h56",
      "01h23 à 02h34,03h45 à 04h56"
    ],
  };

  render(
    <SafeplaceTimetable
      safeplace={safeplace}
      setSafeplace={setSafeplace}
      isReadOnly={false}
    />
  );

  expect(screen.getAllByDisplayValue("01").length).toEqual(7);
  screen.getAllByDisplayValue("01").forEach(openingHour => {
    fireEvent.change(openingHour, { target: { value: "12" } });
  });

  expect(setSafeplace).toBeCalledTimes(7);
});

test('render SafeplaceTimetableDay', () => {
  const setDay = jest.fn();
  const day = {
    name: "",
    isChecked: true,
    timetable: [
      "01:23",
      "02:34",
      "03:45",
      "04:56"
    ],
  };

  render(
    <SafeplaceTimetableDay
      day={day}
      setDay={setDay}
      isReadOnly={false}
    />
  );

  expect(screen.getByDisplayValue("01")).toBeInTheDocument();
  expect(screen.getByDisplayValue("23")).toBeInTheDocument();
  expect(screen.getByDisplayValue("02")).toBeInTheDocument();
  expect(screen.getByDisplayValue("34")).toBeInTheDocument();
  expect(screen.getByDisplayValue("03")).toBeInTheDocument();
  expect(screen.getByDisplayValue("45")).toBeInTheDocument();
  expect(screen.getByDisplayValue("04")).toBeInTheDocument();
  expect(screen.getByDisplayValue("56")).toBeInTheDocument();

  fireEvent.change(screen.getByDisplayValue("01"), { target: { value: "12" } });
  fireEvent.change(screen.getByDisplayValue("23"), { target: { value: "12" } });
  fireEvent.change(screen.getByDisplayValue("02"), { target: { value: "12" } });
  fireEvent.change(screen.getByDisplayValue("34"), { target: { value: "12" } });
  fireEvent.change(screen.getByDisplayValue("03"), { target: { value: "12" } });
  fireEvent.change(screen.getByDisplayValue("45"), { target: { value: "12" } });
  fireEvent.change(screen.getByDisplayValue("04"), { target: { value: "12" } });
  fireEvent.change(screen.getByDisplayValue("56"), { target: { value: "12" } });

  expect(screen.getByRole("checkbox")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("checkbox"));

  expect(setDay).toBeCalledTimes(9);
});

test('render TimeInput', () => {
  const setValue = jest.fn();

  render(
    <TimeInput
      value="01:23"
      setValue={setValue}
      readonly={false}
    />
  );

  expect(screen.getByDisplayValue("01")).toBeInTheDocument();
  expect(screen.getByDisplayValue("23")).toBeInTheDocument();

  fireEvent.change(screen.getByDisplayValue("01"), { target: { value: "12" } });
  fireEvent.change(screen.getByDisplayValue("23"), { target: { value: "12" } });

  expect(setValue).toBeCalledTimes(2);
});

test('test splitValue', () => {
  expect(splitValue("01:23")).toEqual([ "01", "23" ]);
  expect(splitValue("0123")).toEqual([ "", "" ]);
});