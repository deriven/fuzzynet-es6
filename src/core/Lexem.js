import IExpression from './IExpression'

/**
 * @abstract
 */
export default class extends IExpression {
  /**
   * @override
   * @returns {string}
   */
  get text () {}
  /**
   * @returns {string}
   */
  toString () {
    return this.text
  }
}
