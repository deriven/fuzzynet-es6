import Lexem from './Lexem'

export default class extends Lexem {
  /**
   * constructor
   * @param {NamedVariable} varType
   * @param {boolean} input
   */
  constructor (namedVar, input) {
    super()
    this._var = namedVar
    if (input !== undefined) {
      this._input = input
    } else {
      this._input = true
    }
  }

  /**
   * @returns {NamedVariable}
   */
  get namedVar () {
    return this._var
  }

  /**
   * @param {NamedVariable} val
   */
  set namedVar (val) {
    this._var = val
  }

  /**
   * @override
   * @returns {string}
   */
  get text () {
    return this._var.name
  }

  /**
   * @returns {boolean}
   */
  get input () {
    return this._input
  }

  /**
   * @param {boolean} val
   */
  set input (val) {
    this._input = val
  }
}
