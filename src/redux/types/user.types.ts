export const SET_AUTHENTICATED = 'SET_AUTHENTICATED';

export interface IUserCredentials {
    _id: string;
    token: string;
}

export interface UserAuthenticateAction {
    type: typeof SET_AUTHENTICATED;
    payload?: IUserCredentials;
}

export type UserActionTypes = UserAuthenticateAction;