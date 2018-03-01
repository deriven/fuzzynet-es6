import Conditions from './Conditions'

/**
 * Implements common functionality of fuzzy rules
 * @abstract
 */
export default class {
  constructor () {
    this._condition = new Conditions()
  }

  /**
   * @returns {Conditions} Condition (IF) part of the rule
   */
  get condition () {
    return this._condition
  }

  /**
   * Condition (IF) part of the rule
   * @param {Conditions} val
   */
  set condition (val) {
    this._condition = val
  }

  /**
   * @returns {SingleCondition} Conclusion (THEN) part of the rule
   */
  get conclusion () {
    return this._conclusion
  }

  /**
   * @param {SingleCondition} val Conclusion (THEN) part of the rule
   */
  set conclusion (val) {
    this._conclusion = val
  }
}
