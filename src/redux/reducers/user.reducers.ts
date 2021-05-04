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
                    _id: action.payload._id,
                    token: action.payload.token
                }
            };
        }
        default:
            return state;
    }
}