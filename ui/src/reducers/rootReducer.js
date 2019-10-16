import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import searchReducer from './searchReducer';
import sourcesReducer from './sourcesReducer';
import { reducer as formReducer } from 'redux-form';
import uiReducer from './uiReducer';

export default (history) => combineReducers({
  search: searchReducer,
  sources: sourcesReducer,
  form: formReducer,
  router: connectRouter(history),
  ui: uiReducer,
});