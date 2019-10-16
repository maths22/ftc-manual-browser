import { RSAA } from 'redux-api-middleware';

export const SEARCH_REQUEST = 'SEARCH_REQUEST';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const GET_SOURCES_REQUEST = 'GET_SOURCES_REQUEST';
export const GET_SOURCES_SUCCESS = 'GET_SOURCES_SUCCESS';
export const GET_SOURCES_FAILURE = 'GET_SOURCES_FAILURE';

export const API_HOST = process.env.REACT_APP_API_HOST || '';
export const API_BASE = `${API_HOST}/api`;

export const search = ({query, page, size}) => ({
  [RSAA]: {
    endpoint: `${API_BASE}/texts/search?page=${page}&size=${size}`,
    method: 'POST',
    body: query,
    types: [
      SEARCH_REQUEST,
      SEARCH_SUCCESS,
      SEARCH_FAILURE
    ]
  }
});

export const getSources = () => ({
  [RSAA]: {
    endpoint: `${API_BASE}/sources`,
    method: 'GET',
    types: [
      GET_SOURCES_REQUEST,
      GET_SOURCES_SUCCESS,
      GET_SOURCES_FAILURE
    ]
  }
});