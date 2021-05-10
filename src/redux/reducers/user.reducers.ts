import { IUserCredentials, UserActionTypes, SET_AUTHENTICATED } from '../types';

interface UserState {
    credentials: IUserCredentials;
}

const initialState: UserState = {
    credentials: {
        _id: "",
        token: ""
    }
};

export function userReducer(
    state: UserState = initialState,
    action: UserActionTypes
): UserState {
    switch (action.type) {
        case SET_AUTHENTICATED: {
            return {
                ...state,
                credentials: {
                    ...state.credentials,
                    _id: (action.payload) ? action.payload._id : state.credentials._id,
                    token: (action.payload) ? action.payload.token : state.credentials.token
                }
            };
        }
        default:
            return state;
    }
}