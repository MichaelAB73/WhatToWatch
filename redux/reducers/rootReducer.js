import { combineReducers } from 'redux';
import userReducer from './userReducer';
import listsReducer from './listsReducer';

export const rootReducer = combineReducers({
  user: userReducer,
  lists: listsReducer,
});
