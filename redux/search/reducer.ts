/*
 * Built by Astrocoders
 * @flow
 */

import { FETCH_SEARCH, LOAD_SEARCH_RESULTS, CLEAR_SEARCH } from './constants'

type Claim = {
  slug: string,
  name: string,
  summary: string,
}

type State = {
  claimsFromSearch: Array<Claim>,
  searchText: string,
  isSearch: boolean,
}

const initialState = {
  claimsFromSearch: [],
  searchText: '',
  isSearching: false,
}

export default function search(state: State = initialState, { type, payload }) {
  switch (type) {
    case FETCH_SEARCH:
      return {
        ...state,
        isSearching: true,
        searchText: payload.searchText,
      }
    case LOAD_SEARCH_RESULTS:
      return {
        ...state,
        isSearching: false,
        claimsFromSearch: payload.claims,
      }
    case CLEAR_SEARCH:
      return {
        ...state,
        searchText: '',
        claimsFromSearch: [],
        isSearching: false,
      }
    default:
      return { ...state }
  }
}
