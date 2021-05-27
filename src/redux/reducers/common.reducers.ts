import { FetchActionTypes, FETCH_FAILURE } from '../types';

interface ErrorState {
    error: any;
}

const initialState: ErrorState = {
    error: {}
}

export function commonReducer(
    state: ErrorState = initialState,
    action: FetchActionTypes
) {
    switch (action.type) {
        case FETCH_FAILURE: {
            return {
                ...state,
                error: action.payload
            };
        }
        default:
            return state;
    }
}