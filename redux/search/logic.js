/*
 * Built by Astrocoders
 * @flow
 */

import { createLogic } from 'redux-logic'

import { FETCH_SEARCH } from './constants'
import { loadSearchResults } from './actions'

const fetchSearchLogic = createLogic({
  type: FETCH_SEARCH,
  latest: true,
  debounce: 1000,
  process({ action }, dispatch, done) {
    const { searchText } = action.payload

    // Meteor.call('claims/search', { searchText }, (error, results) => {
    //   if (error) {
    //     console.warn('Error in claims/search', error)
    //     return
    //   }

    //   dispatch(
    //     loadSearchResults({
    //       results,
    //     }),
    //   )
    //   done()
    // })
  },
})

export default [fetchSearchLogic]
