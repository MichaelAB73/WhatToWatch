import { SET_LISTS, LOGOUT } from '../actionTypes';

const initialState = {
  lists: [],
};

const listsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LISTS:
      return { ...state, lists: action.payload };
    case LOGOUT:
      return { ...state, lists: [] };
    default:
      return state;
  }
};

export default listsReducer;
