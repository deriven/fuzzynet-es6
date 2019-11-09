import NormalMembershipFunction from './NormalMembershipFunction'
import IMembershipFunction from './IMembershipFunction'

/**
 * Triangular membership function
 */
export default class extends IMembershipFunction {
  /**
   * Constructor
   * @param {number} x1 Point 1
   * @param {number} x2 Point 2
   * @param {number} x3 Point 3
   */
  constructor (x1, x2, x3) {
    super()
    if ((x1 <= x2 && x2 <= x3) === false) {
      throw new Error('x1 <= x2 <= x3')
    }
    this._x1 = x1
    this._x2 = x2
    this._x3 = x3
  }

  /**
   * @returns {number} Point 1
   */
  get x1 () {
    return this._x1
  }

  /**
   * Point 1
   * @param {number} val
   */
  set x1 (val) {
    this._x1 = val
  }

  /**
   * @returns {number} Point 2
   */
  get x2 () {
    return this._x2
  }

  /**
   * Point 2
   * @param {number} val
   */
  set x2 (val) {
    this._x2 = val
  }

  /**
   * @returns {number} Point 3
   */
  get x3 () {
    return this._x3
  }

  /**
   * Point 3
   * @param {number} val
   */
  set x3 (val) {
    this._x3 = val
  }

  /**
   * Evaluate value of the membership function
   * @param {number} x Argument (x axis value)
   * @returns {number}
   */
  getValue (x) {
    var result = 0

    if (x === this._x1 && x === this._x2) {
      result = 1.0
    } else if (x === this._x2 && x === this._x3) {
      result = 1.0
    } else if (x <= this._x1 || x >= this._x3) {
      result = 0
    } else if (x === this._x2) {
      result = 1
    } else if ((x > this._x1) && (x < this._x2)) {
      result = (x / (this._x2 - this._x1)) - (this._x1 / (this._x2 - this._x1))
    } else {
      result = (-x / (this._x3 - this._x2)) + (this._x3 / (this._x3 - this._x2))
    }

    return result
  }

  /**
   * Approximately converts to normal membership function
   * @returns {NormalMembershipFunction}
   */
  toNormalMf () {
    const b = this._x2
    const sigma25 = (this._x3 - this._x1) / 2.0
    const sigma = sigma25 / 2.5
    return new NormalMembershipFunction(b, sigma)
  }
}
