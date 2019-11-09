import IMembershipFunction from './IMembershipFunction'

/**
 * Constant membership function
 */
export default class extends IMembershipFunction {
  /**
   * Constructor
   * @param {number} constVal Constant value
   */
  constructor (constVal) {
    super()
    if (constVal < 0.0 || constVal > 1.0) {
      throw new Error('Must be between 0.0 and 1.0')
    }
    this._constValue = constVal
  }

  /**
   * Evaluate value of the membership function
   * @param {number} x Argument (x axis value)
   * @returns {number}
   */
  getValue (x) {
    return this._constValue
  }
}
