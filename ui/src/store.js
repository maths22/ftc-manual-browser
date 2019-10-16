import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { apiMiddleware } from 'redux-api-middleware';
import rootReducer from './reducers/rootReducer';
import {composeWithDevTools} from 'redux-devtools-extension';
import analyticsMiddleware from './middleware/analyticsMiddleware';


export default function configureStore(history) {
  return createStore(
      rootReducer(history),
      composeWithDevTools(
          applyMiddleware(
            routerMiddleware(history),
            analyticsMiddleware,
            thunk,
            apiMiddleware,
        )
      )
  );
}