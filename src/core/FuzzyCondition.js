import * as HedgeType from '../enums/HedgeType'
import SingleCondition from './SingleCondition'

/**
 * Condition of fuzzy rule for the Mamdani systems
 */
export default class extends SingleCondition {
  /**
   * Constructor
   * @param {FuzzyVariable} [namedVar] A linguistic variable to which the condition is related
   * @param {FuzzyTerm} [term] A term in expression 'var is term'
   * @param {Boolean} [useNot] Does condition contain 'not'
   * @param {HedgeType} [hedge] Hedge modifier
   */
  constructor (namedVar, term, useNot, hedge) {
    super(namedVar, term, useNot)
    this._hedge = hedge || HedgeType.None
  }

  /**
   * @returns {HedgeType} Hedge modifier
   */
  get hedge () {
    return this._hedge
  }

  /**
   * Hedge modifier
   * @param {HedgeType} val
   */
  set hedge (val) {
    this._hedge = val
  }
}
