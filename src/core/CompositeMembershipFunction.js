import * as MfCompositionType from '../enums/MfCompositionType'
import IMembershipFunction from './IMembershipFunction'

/**
 * Composition of several membership functions represened as single membership function
 */
export default class extends IMembershipFunction {
  /**
   * Constructor
   * @param {MfCompositionType} composType Membership functions composition type
   * @param {Array} [mfs] Membership functions
   */
  constructor (composType, mfs) {
    super()
    this._composType = composType
    this._mfs = mfs || []
  }

  /**
   * @returns {Array} List of membership functions
   */
  get membershipFunction () {
    return this._mfs
  }

  /**
   * @returns {MfCompositionType} Membership functions composition type
   */
  get compositionType () {
    return this._composType
  }

  /**
   * Membership functions composition type
   * @param {MfCompositionType} val
   */
  set compositionType (val) {
    this._composType = val
  }

  /**
   * Evaluate value of the membership function
   * @param {number} x Argument (x axis value)
   * @returns {number}
   */
  getValue (x) {
    const mfsLength = this._mfs.length
    if (mfsLength === 0) {
      return 0.0
    }
    if (mfsLength === 1) {
      return this._mfs[0].getValue(x)
    }
    let result = this._mfs[0].getValue(x)
    for (let i = 1; i < mfsLength; i++) {
      result = this.compose(result, this._mfs[i].getValue(x))
    }
    return result
  }

  /**
   *
   * @param {number} val1
   * @param {number} val2
   * @returns {number}
   */
  compose (val1, val2) {
    switch (this._composType) {
      case MfCompositionType.Max:
        return Math.max(val1, val2)
      case MfCompositionType.Min:
        return Math.min(val1, val2)
      case MfCompositionType.Prod:
        return val1 * val2
      case MfCompositionType.Sum:
        return val1 + val2
      default:
        throw new Error('Internal exception')
    }
  }
}
