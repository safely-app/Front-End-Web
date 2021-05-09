import { request, failure } from './common.actions';
import {ActionCreator} from 'redux';
import { User } from '../../services';
import { IUserCredentials, SET_AUTHENTICATED, UserActionTypes } from '../types';

const authenticationSuccess: ActionCreator<UserActionTypes> = (
    credentials: IUserCredentials
) => {
    return {
        type: SET_AUTHENTICATED,
        payload: credentials
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
                dispatch(failure(`Register failed: ${error}`));
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
                console.log(response.data);
                dispatch(authenticationSuccess(response.data));
            }).catch(error => {
                dispatch(failure(`Login failed: ${error}`));
            });
    };
}