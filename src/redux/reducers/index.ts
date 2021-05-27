import {combineReducers} from 'redux';
import {userReducer} from './user.reducers';
import {commonReducer} from './common.reducers';

export const rootReducer = combineReducers({
    user: userReducer,
    common: commonReducer
});

export type RootState = ReturnType<typeof rootReducer>;