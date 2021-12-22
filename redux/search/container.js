/*
 * Built by Astrocoders
 * @flow
 */

import { connect } from 'react-redux'
import { compose } from 'recompose'

import * as actionsToProps from './actions'

export const redux = connect(
  state => ({
    searchState: state.search,
  }),
  actionsToProps,
)

export default compose(redux)
