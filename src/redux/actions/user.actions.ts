import { request, failure } from './common.actions';
import {ActionCreator} from 'redux';
import { User } from '../../services';
import { IUserCredentials, SET_AUTHENTICATED, UserActionTypes } from '../types';
import log from 'loglevel';

const authenticationSuccess: ActionCreator<UserActionTypes> = (
    credentials: IUserCredentials
) => {
    return {
        type: SET_AUTHENTICATED,
        payload: credentials
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
