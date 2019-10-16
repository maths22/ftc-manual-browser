import {GET_SOURCES_REQUEST, GET_SOURCES_SUCCESS} from '../actions/api';

const initialState = null;

export default function (
    state = initialState,
    action
) {
  switch (action.type) {
    case GET_SOURCES_REQUEST:
      return Object.assign({}, state, {inProgress: true});
    case GET_SOURCES_SUCCESS:
      return Object.assign({}, state, {inProgress: false, list: action.payload});
    default:
      return state;
  }
}