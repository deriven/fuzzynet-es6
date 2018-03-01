import NamedValue from './NamedValue'

/**
 * Linguistic term
 */
export default class extends NamedValue {
  /**
   * Constructor
   * @param {string} name Term name
   * @param {IMembershipFunction} mf
   */
  constructor (name, mf) {
    super(name)
    this._mf = mf
  }

  /**
   * @returns {IMembershipFunction} Membership function initially associated with the term
   */
  get membershipFunction () {
    return this._mf
  }
}
