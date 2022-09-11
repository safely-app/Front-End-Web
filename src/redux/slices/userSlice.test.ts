import reducer, {
  setCredentials,
  setInfo,
  disconnect,
  setProfessionalInfo
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
  },
  professionalInfo: {
    userId: "",
    companyName: "",
    companyAddress: "",
    companyAddress2: "",
    billingAddress: "",
    clientNumberTVA: "",
    personalPhone: "",
    companyPhone: "",
    registrationCity: "",
    artisanNumber: "",
    SIREN: "",
    SIRET: "",
    type: "",
    RCS: "",
    id: "",
  },
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

test('ensure that setProfessional occurs without technical errors', () => {
  expect(reducer(initialState, setProfessionalInfo({
    userId: "test",
    companyName: "test",
    companyAddress: "test",
    companyAddress2: "test",
    billingAddress: "test",
    clientNumberTVA: "test",
    personalPhone: "test",
    companyPhone: "test",
    registrationCity: "test",
    artisanNumber: "test",
    SIREN: "test",
    SIRET: "test",
    type: "test",
    RCS: "test",
    id: "test",
  }))).toEqual({
    ...initialState,
    professionalInfo: {
      userId: "test",
      companyName: "test",
      companyAddress: "test",
      companyAddress2: "test",
      billingAddress: "test",
      clientNumberTVA: "test",
      personalPhone: "test",
      companyPhone: "test",
      registrationCity: "test",
      artisanNumber: "test",
      SIREN: "test",
      SIRET: "test",
      type: "test",
      RCS: "test",
      id: "test",
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
