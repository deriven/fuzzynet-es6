import IExpression from './IExpression'

export default class extends IExpression {
  /**
   * constructor
   * @param {IExpression[]} expressions
   * @param {FuzzyCondition} condition
   */
  constructor (expressions, condition) {
    super()
    this._expressions = expressions
    this._condition = condition
  }

  /**
   * @returns {IExpression[]}
   */
  get expressions () {
    return this._expressions
  }

  /**
   * @param {IExpression[]} val
   */
  set expressions (val) {
    this._expressions = val
  }

  /**
   * @returns {FuzzyCondition}
   */
  get condition () {
    return this._condition
  }

  /**
   * @param {FuzzyCondition} val
   */
  set condition (val) {
    this._condition = val
  }

  /**
   * @override
   * @returns {string}
   */
  get text () {
    let sb = ''
    for (const ex of this._expressions) {
      sb += ex.text
    }
    return sb
  }
}
