import FuzzyCondition from './FuzzyCondition'
import GenericFuzzyRule from './GenericFuzzyRule'

/**
 * Fuzzy rule for Mamdani fuzzy system
 */
export default class extends GenericFuzzyRule {
  /**
   * Constructor. NOTE: a rule cannot be created directly, only via MamdaniFuzzySystem.emptyRule or MamdaniFuzzySystem.parseRule
   */
  constructor () {
    super()
    this._conclusion = new FuzzyCondition()
    this._weight = 1.0
  }

  /**
   * @returns {number} Weight of the rule
   */
  get weight () {
    return this._weight
  }

  /**
   * @param {number} val Weight of the rule
   */
  set weight (val) {
    this._weight = val
  }
}
