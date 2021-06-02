import { request, failure } from './common.actions';
import {ActionCreator} from 'redux';
import { User } from '../../services';
import {
    IUserCredentials,
    IUserInfo,
    SET_AUTHENTICATED,
    SET_USER_INFO,
    UserActionTypes
} from '../types';
import log from 'loglevel';

const authenticationSuccess: ActionCreator<UserActionTypes> = (
    credentials: IUserCredentials
) => {
    return {
        type: SET_AUTHENTICATED,
        payload: credentials
    };
}

const getUserInfoSuccess: ActionCreator<UserActionTypes> = (
    userInfo: IUserInfo
) => {
    return {
        type: SET_USER_INFO,
        payload: userInfo
    };
}

export function getUserInfo(id: string, token: string) {
    return dispatch => {
        dispatch(request());
        return User.get(id, token)
            .then(response => {
                dispatch(getUserInfoSuccess(response.data));
            }).catch(error => {
                dispatch(failure(`Getting user failed: ${error.response.data}`));
            });
    };
}

export function disconnectUser() {
    return dispatch => {
        dispatch(authenticationSuccess({
            type: SET_AUTHENTICATED,
            payload: {
                _id: "",
                token: ""
            }
        }));
    };
}

export function registerUser(email: string, username: string, password: string) {
    return dispatch => {
        dispatch(request());
        return User.register({
                email: email,
                username: username,
                password: password
            }).then(response => {
                dispatch(authenticationSuccess(response.data));
            }).catch(error => {
                dispatch(failure(`Register failed: ${error.response.data}`));
            });
    };
}

export function loginUser(email: string, username: string, password: string) {
    return dispatch => {
        dispatch(request());
        return User.login({
                email: email,
                username: username,
                password: password
            }).then(response => {
                dispatch(authenticationSuccess(response.data));
            }).catch(error => {
                const errorResponse = error.response;
                const errorData = (errorResponse) ? errorResponse.data : undefined;
                const errorMsg = (errorData) ? errorData.error : undefined;

                log.error(errorResponse);
                log.error(errorData);
                log.error(errorMsg);
                dispatch(failure(`Login failed: ${errorMsg}`));
            });
    };
}
