import Lexem from './Lexem'

export default class extends Lexem {
  /**
   * constructor
   * @param {string} name
   */
  constructor (name) {
    super()
    this._name = name
  }

  /**
   * @override
   * @returns {string}
   */
  get text () {
    return this._name
  }
}
