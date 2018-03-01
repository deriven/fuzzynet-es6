import * as OperatorType from '../enums/OperatorType'
import ICondition from './ICondition'

/**
 * Several conditions linked by or/and operators
 */
export default class extends ICondition {
  constructor () {
    super()
    this._not = false
    this._op = OperatorType.And
    this._conditions = []
  }

  /**
   * @returns {Boolean} Is MF inverted
   */
  get useNot () {
    return this._not
  }

  /**
   * Is MF inverted
   * @param {Boolean} val
   */
  set useNot (val) {
    this._not = val
  }

  /**
   * @returns {OperatorType} Operator that links expressions (and/or)
   */
  get op () {
    return this._not
  }

  /**
   * Operator that links expressions (and/or)
   * @param {OperatorType} val
   */
  set op (val) {
    this._not = val
  }

  /**
   * @returns {Array} A list of conditions (single or multiples)
   */
  get conditionsList () {
    return this._conditions
  }
}
