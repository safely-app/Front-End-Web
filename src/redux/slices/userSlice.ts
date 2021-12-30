import { createSlice } from '@reduxjs/toolkit';

interface IUserCredentials {
    _id: string;
    token: string;
}

interface IUserInfo {
    id: string;
    username: string;
    email: string;
    role: string;
}

interface UserState {
    credentials: IUserCredentials;
    userInfo: IUserInfo;
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
                role: action.payload.role
            };
        },
        disconnect: (state) => {
            state.credentials = {
                _id: "",
                token: ""
            };
            state.userInfo = {
                id: "",
                username: "",
                email: "",
                role: ""
            };
        },
    }
});

export const {
    setCredentials,
    setInfo,
    disconnect
} = userSlice.actions;

export default userSlice.reducer;
