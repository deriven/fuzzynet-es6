import Lexem from './Lexem'

export default class extends Lexem {
  /**
   * constructor
   * @param {NamedValue} term
   * @param {boolean} input
   */
  constructor (term, input) {
    super()
    this._term = term
    this._input = input
  }

  /**
   * @returns {NamedValue}
   */
  get term () {
    return this._term
  }

  /**
   * @param {NamedValue} val
   */
  set term (val) {
    this._term = val
  }

  /**
   * @override
   * @returns {string}
   */
  get text () {
    return this._term.name
  }

  /**
   * @returns {TermLexem}
   */
  get alternative () {
    return this._alternative || null
  }

  /**
   * @param {TermLexem} val
   */
  set alternative (val) {
    this._alternative = val
  }
}
