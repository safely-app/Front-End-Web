import reducer, {
  setReduxSafeplaces
} from './safeplaceSlice';

const initialState = {
  date: 0,
  safeplaces: []
};

test('ensure that empty reducer returns initial state', () => {
  expect(reducer(undefined, { type: undefined })).toEqual(initialState);
});

test('ensure that setReduxSafeplaces occurs without technical errors', () => {
  const currentDate = Date.now();

  expect(reducer(initialState, setReduxSafeplaces({
    date: currentDate,
    safeplaces: [
      {
        id: "s1",
        name: "Name",
        city: "City",
        type: "Type",
        address: "Address",
        description: "Description",
        dayTimetable: [ null, null, null, null, null, null, null ],
        coordinate: [ "1", "1" ],
        ownerId: "o1",
      }
    ]
  }))).toEqual({
    ...initialState,
    date: currentDate,
    safeplaces: [
      {
        id: "s1",
        name: "Name",
        city: "City",
        type: "Type",
        address: "Address",
        description: "Description",
        dayTimetable: [ null, null, null, null, null, null, null ],
        coordinate: [ "1", "1" ],
        ownerId: "o1",
      }
    ]
  })
});