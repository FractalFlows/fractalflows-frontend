/*
 * Built by Astrocoders
 * @flow
 */

import { FETCH_SEARCH, CLEAR_SEARCH, LOAD_SEARCH_RESULTS } from './constants'

export function fetchSearch({ searchText }) {
  return {
    type: FETCH_SEARCH,
    payload: {
      searchText,
    },
  }
}

export function clearSearch() {
  return {
    type: CLEAR_SEARCH,
  }
}

export function loadSearchResults({ results }) {
  return {
    type: LOAD_SEARCH_RESULTS,
    payload: {
      claims: results,
    },
  }
}
