import NamedVariable from './NamedVariable'

/**
 * Linguistic variable
 */
export default class extends NamedVariable {
  /**
   * Constructor
   * @param {string} name Name of the variable
   * @param {number} min Minimum value
   * @param {number} max Maximum value
   */
  constructor (name, min, max) {
    super(name)
    if (min > max) {
      throw new Error('Maximum value must be greater than minimum one.')
    }

    this._min = min
    this._max = max
    this._terms = []
  }

  /**
   * @returns {FuzzyTerm[]} Terms
   */
  get terms () {
    return this._terms
  }

  /**
   * @returns {NamedValue[]} Named values
   */
  get values () {
    return this._terms
  }

  /**
   * Get membership function (term) by name
   * @param {string} name Term name
   * @returns {FuzzyTerm}
   */
  getTermByName (name) {
    for (let term of this._terms) {
      if (term.name === name) {
        return term
      }
    }

    throw new Error('Key not found')
  }

  /**
   * @returns {number} Maximum value of the variable
   */
  get max () {
    return this._max
  }

  /**
   * Set maximum value of the variable
   * @param {number} val
   */
  set max (val) {
    this._max = val
  }

  /**
   * @returns {number} Minimum value of the variable
   */
  get min () {
    return this._min
  }

  /**
   * Set minimum value of the variable
   * @param {number} val
   */
  set min (val) {
    this._min = val
  }
}
