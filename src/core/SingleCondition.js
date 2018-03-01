import ICondition from './ICondition'

/**
 * Single condition
 */
export default class extends ICondition {
  /**
   * Constructor
   * @param {NamedVariable} [namedVar] A linguistic variable to which the condition is related
   * @param {NamedValue} [term] A term in expression 'var is term'
   * @param {Boolean} [useNot] Does condition contain 'not'
   */
  constructor (namedVar, term, useNot) {
    super()
    this._var = namedVar || null
    this._term = term || null
    if (useNot !== undefined) {
      this._not = useNot
    } else {
      this._not = false
    }
  }

  /**
   * @returns {NamedVariable} A linguistic variable to which the condition is related
   */
  get namedVar () {
    return this._var
  }

  /**
   * A linguistic variable to which the condition is related
   * @param {NamedVariable} val
   */
  set namedVar (val) {
    this._var = val
  }

  /**
   * @returns {NamedValue} A term in expression 'var is term'
   */
  get term () {
    return this._term
  }

  /**
   * A term in expression 'var is term'
   * @param {NamedValue} val
   */
  set term (val) {
    this._term = val
  }

  /**
   * @returns {Boolean} Is MF inverted
   */
  get useNot () {
    return this._not
  }

  /**
   * Is MF inverted
   * @param {Boolean} val
   */
  set useNot (val) {
    this._not = val
  }
}
