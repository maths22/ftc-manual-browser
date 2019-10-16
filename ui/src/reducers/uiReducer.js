import {SET_TITLE} from '../actions/ui';

const initialState = {};

export default function (
    state = initialState,
    action
) {
  switch (action.type) {
    case SET_TITLE:
      return Object.assign({}, state, {title: action.title});
    default:
      return state;
  }
}