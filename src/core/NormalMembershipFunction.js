import IMembershipFunction from './IMembershipFunction'

/**
 * Normal membership function
 */
export default class extends IMembershipFunction {
  /**
   * Constructor
   * @param {number} [b] Parameter b (center of MF)
   * @param {number} [sigma] Sigma
   */
  constructor (b, sigma) {
    super()
    this._b = b || 0.0
    this._sigma = sigma || 1.0
  }

  /**
   * @returns {number} Parameter b (center of MF)
   */
  get b () {
    return this._b
  }

  /**
   * Parameter b (center of MF)
   * @param {number} val
   */
  set b (val) {
    this._b = val
  }

  /**
   * @returns {number} Sigma
   */
  get sigma () {
    return this._sigma
  }

  /**
   * Sigma
   * @param {number} val
   */
  set sigma (val) {
    this._sigma = val
  }

  /**
   * Evaluate value of the membership function
   * @param {number} x Argument (x axis value)
   * @returns {number}
   */
  getValue (x) {
    return Math.exp(-(x - this._b) * (x - this._b) / (2.0 * this._sigma * this._sigma))
  }
}
