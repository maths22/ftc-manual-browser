import {SEARCH_REQUEST, SEARCH_SUCCESS} from '../actions/api';

const initialState = null;

export default function (
    state = initialState,
    action
) {
  switch (action.type) {
    case SEARCH_REQUEST:
      return Object.assign({}, state, {inProgress: true});
    case SEARCH_SUCCESS:
      return Object.assign({}, state, {inProgress: false, result: action.payload});
    default:
      return state;
  }
}