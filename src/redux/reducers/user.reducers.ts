import { IUserCredentials, UserActionTypes, SET_AUTHENTICATED, SET_USER_INFO, IUserInfo } from '../types';

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
        case SET_USER_INFO: {
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    id: (action.payload) ? action.payload.id : state.userInfo.id,
                    username: (action.payload) ? action.payload.username : state.userInfo.username,
                    email: (action.payload) ? action.payload.email : state.userInfo.email,
                    role: (action.payload) ? action.payload.role : state.userInfo.role
                }
            }
        }
        default:
            return state;
    }
}