import reducer, {
  setCredentials,
  setInfo,
  disconnect
} from './userSlice';

const initialState = {
  credentials: {
    _id: "",
    token: ""
  },
  userInfo: {
    email: "",
    id: "",
    role: "",
    username: ""
  }
};

test('ensure that empty reducer returns initial state', () => {
  expect(reducer(undefined, { type: undefined })).toEqual(initialState);
});

test('ensure that setCredentials occurs without technical errors', () => {
  expect(reducer(initialState, setCredentials({
    _id: "random_id",
    token: "random_token"
  }))).toEqual({
    ...initialState,
    credentials: {
      _id: "random_id",
      token: "random_token"
    }
  });
});

test('ensure that setInfo occurs without technical errors', () => {
  expect(reducer(initialState, setInfo({
    email: "random_email",
    id: "random_id",
    role: "random_role",
    username: "random_username"
  }))).toEqual({
    ...initialState,
    userInfo: {
      email: "random_email",
      id: "random_id",
      role: "random_role",
      username: "random_username"
    }
  });
});

test('ensure that disconnect occurs without technical errors', () => {
  expect(reducer({
    ...initialState,
    credentials: {
      _id: "random_id",
      token: "random_token"
    }
  }, disconnect())).toEqual(initialState);
});
