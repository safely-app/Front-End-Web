import { ActionCreator } from "redux";
import { FetchActionTypes, FETCH_FAILURE, FETCH_REQUEST } from "../types/common.types";

export const request: ActionCreator<FetchActionTypes> = () => {
    return {
        type: FETCH_REQUEST
    }
};

export const failure: ActionCreator<FetchActionTypes> = (error: any) => {
    return {
        type: FETCH_FAILURE,
        payload: error
    };
};