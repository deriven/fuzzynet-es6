import NamedVariable from './NamedVariable'

/**
 * Used as an output variable in Sugeno fuzzy inference system.
 */
export default class extends NamedVariable {
  /**
   * Constructor
   * @param {string} name Name of the variable
   */
  constructor (name) {
    super(name)
    this._functions = []
  }

  /**
   * @returns {SugenoFunction[]} List of functions that belongs to the variable
   */
  get functions () {
    return this._functions
  }

  /**
   * @returns {NamedValue[]} List of functions that belongs to the variable (implementation of INamedVariable)
   */
  get values () {
    return this._functions
  }

  /**
   * Find function by its name
   * @param {string} name Name of the function
   * @returns {SugenoFunction} Found function
   */
  getFuncByName (name) {
    for (let func of this._functions) {
      if (func.name === name) {
        return func
      }
    }

    throw new Error('Key not found')
  }
}
