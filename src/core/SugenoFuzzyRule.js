import GenericFuzzyRule from './GenericFuzzyRule'
import SugenoCondition from './SugenoCondition'

/**
 * Fuzzy rule for Sugeno fuzzy system
 */
export default class extends GenericFuzzyRule {
  /**
   * Constructor. NOTE: a rule cannot be created directly, only via SugenoFuzzySystem.emptyRule or SugenoFuzzySystem.parseRule
   */
  constructor () {
    super()
    this._conclusion = new SugenoCondition()
    this._weight = 1.0
  }
}
