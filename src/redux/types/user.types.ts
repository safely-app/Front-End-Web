export const SET_AUTHENTICATED = 'SET_AUTHENTICATED';
export const SET_USER_INFO = 'SET_USER_INFO';

export interface IUserCredentials {
    _id: string;
    token: string;
}

export interface IUserInfo {
    id: string;
    username: string;
    email: string;
    role: string;
}

export interface UserAuthenticateAction {
    type: typeof SET_AUTHENTICATED;
    payload?: IUserCredentials;
}

export interface UserGetInfoAction {
    type: typeof SET_USER_INFO;
    payload?: IUserInfo;
}

export type UserActionTypes = UserAuthenticateAction | UserGetInfoAction;