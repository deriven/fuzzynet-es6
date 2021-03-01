/**
 * Trapezoid membership function
 */
import IMembershipFunction from './IMembershipFunction'

export default class extends IMembershipFunction {
  /**
   * Constructor
   * @param {number} x1 Point 1
   * @param {number} x2 Point 2
   * @param {number} x3 Point 3
   * @param {number} x4 Point 4
   */
  constructor (x1, x2, x3, x4) {
    super()
    if ((x1 <= x2 && x2 <= x3 && x3 <= x4) === false) {
      throw new Error('x1 <= x2 <= x3 <= x4')
    }
    this._x1 = x1
    this._x2 = x2
    this._x3 = x3
    this._x4 = x4
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
   * @returns {number} Point 4
   */
  get x4 () {
    return this._x4
  }

  /**
   * Point 4
   * @param {number} val
   */
  set x4 (val) {
    this._x4 = val
  }

  /**
   * Evaluate value of the membership function
   * @param {number} x Argument (x axis value)
   * @returns {number}
   */
  getValue (x) {
    let result = 0

    if (x === this._x1 && x === this._x2) {
      result = 1.0
    } else if (x === this._x3 && x === this._x4) {
      result = 1.0
    } else if (x <= this._x1 || x >= this._x4) {
      result = 0
    } else if ((x >= this._x2) && (x <= this._x3)) {
      result = 1
    } else if ((x > this._x1) && (x < this._x2)) {
      result = (x / (this._x2 - this._x1)) - (this._x1 / (this._x2 - this._x1))
    } else {
      result = (-x / (this._x4 - this._x3)) + (this._x4 / (this._x4 - this._x3))
    }

    return result
  }
}
