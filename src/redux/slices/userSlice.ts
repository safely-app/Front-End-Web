import { createSlice } from '@reduxjs/toolkit';
import IProfessional from '../../components/interfaces/IProfessional';
import IUser from '../../components/interfaces/IUser';

interface IUserCredentials {
  _id: string;
  token: string;
}

interface UserState {
  credentials: IUserCredentials;
  professionalInfo: IProfessional;
  userInfo: IUser;
}

const initialState: UserState = {
  credentials: {
    _id: "",
    token: ""
  },
  userInfo: {
    id: "",
    username: "",
    email: "",
    role: ""
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
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.credentials = {
        _id: action.payload._id,
        token: action.payload.token
      };
    },
    setInfo: (state, action) => {
      state.userInfo = {
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
        role: action.payload.role,
        stripeId: action.payload.stripeId
      };
    },
    setProfessionalInfo: (state, action) => {
      state.professionalInfo = {
        userId: action.payload.userId,
        companyName: action.payload.companyName,
        companyAddress: action.payload.companyAddress,
        companyAddress2: action.payload.companyAddress2,
        billingAddress: action.payload.billingAddress,
        clientNumberTVA: action.payload.clientNumberTVA,
        personalPhone: action.payload.personalPhone,
        companyPhone: action.payload.companyPhone,
        registrationCity: action.payload.registrationCity,
        artisanNumber: action.payload.artisanNumber,
        SIREN: action.payload.SIREN,
        SIRET: action.payload.SIRET,
        type: action.payload.type,
        RCS: action.payload.RCS,
        id: action.payload.id,
      };
    },
    disconnect: (state) => {
      state.credentials = {
        ...initialState.credentials
      };
      state.userInfo = {
        ...initialState.userInfo
      };
      state.professionalInfo = {
        ...initialState.professionalInfo
      };
    },
  }
});

export const {
  setCredentials,
  setInfo,
  setProfessionalInfo,
  disconnect
} = userSlice.actions;

export default userSlice.reducer;
