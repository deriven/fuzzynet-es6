import * as NameHelper from './NameHelper'

/**
 * Base class for named entities
 * @abstract
 */
export default class {
  /**
   * Constructor
   * @param {String} name Name
   */
  constructor (name) {
    if (NameHelper.isValidName(name) === false) {
      throw new Error('Invalid name')
    }
    this._name = name
  }

  /**
   * Name
   * @returns {String}
   */
  get name () {
    return this._name
  }

  /**
   * @param {String} val Name
   */
  set name (val) {
    if (NameHelper.isValidName(val) === false) {
      throw new Error('Invalid name')
    }
    this._name = name
  }
}
