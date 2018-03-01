import * as AndMethod from '../enums/AndMethod'
import * as OrMethod from '../enums/OrMethod'
import * as HedgeType from '../enums/HedgeType'
import * as OperatorType from '../enums/OperatorType'
import Conditions from './Conditions'
import FuzzyCondition from './FuzzyCondition'

/**
 * Common functionality of Mamdani and Sugeno fuzzy systems
 */
export default class {
  /**
   * Constructor
   */
  constructor () {
    this._input = []
    this._andMethod = AndMethod.Min
    this._orMethod = OrMethod.Max
  }

  /**
   * @returns {Array<FuzzyVariable>} Input linguistic variables
   */
  get input () {
    return this._input
  }

  /**
   * @returns {string} And method
   */
  get andMethod () {
    return this._andMethod
  }

  /**
   * And method
   * @param {string} val
   */
  set andMethod (val) {
    this._andMethod = val
  }

  /**
   * @returns {string} Or method
   */
  get orMethod () {
    return this._orMethod
  }

  /**
   * Or method
   * @param {string} val
   */
  set orMethod (val) {
    this._orMethod = val
  }

  /**
   * Get input linguistic variable by its name
   * @param {string} name Variable's name
   * @returns {FuzzyVariable} Found variable
   */
  inputByName (name) {
    var returnVar
    for (let inputVar of this._input) {
      if (inputVar.name === name) {
        returnVar = inputVar
        break
      }
    }
    if (returnVar) {
      return returnVar
    }

    throw new Error('Key not found')
  }

  /**
   * Fuzzify input
   * @param {Map<FuzzyVariable, number>} inputValues
   * @returns {Map<FuzzyVariable, Map<FuzzyTerm, number>>}
   */
  fuzzify (inputValues) {
    // validate input
    if (inputValues.size !== this._input.length) {
      throw new Error('Input values count is incorrect')
    }

    var result = new Map()
    for (let inputVar of this._input) {
      if (inputValues.has(inputVar)) {
        let val = inputValues.get(inputVar)
        if (val < inputVar.min || val > inputVar.max) {
          throw new Error(`Value for the '${inputVar.name}' variable is out of range.`)
        }

        // fill result list
        var resultForVar = new Map()
        for (let term of inputVar.terms) {
          resultForVar.set(term, term.membershipFunction.getValue(val))
        }
        result.set(inputVar, resultForVar)
      } else {
        throw new Error(`Value for the '${inputVar.name}' variable is not present.`)
      }
    }
    return result
  }

  /**
   * Evaluate fuzzy condition (or conditions)
   * @param {object} condition Condition that should be evaluated
   * @param {Map<FuzzyVariable, Map<FuzzyTerm, number>>} fuzzifiedInput Input in fuzzified form
   * @returns {number} Result of evaluation
   */
  evaluateCondition (condition, fuzzifiedInput) {
    var result
    if (condition instanceof Conditions) {
      result = 0.0
      var condListLength = condition.conditionsList.length

      if (condListLength === 0) {
        throw new Error('Inner exception')
      }
      result = this.evaluateCondition(condition.conditionsList[0], fuzzifiedInput)
      if (condListLength !== 1) {
        for (let i = 1; i < condListLength; i++) {
          result = this.evaluateConditionPair(result, this.evaluateCondition(condition.conditionsList[i], fuzzifiedInput), condition.op)
        }
      }

      if (condition.not) {
        result = 1.0 - result
      }
      return result
    }
    if (condition instanceof FuzzyCondition) {
      result = fuzzifiedInput.get(condition.namedVar).get(condition.term)

      switch (condition.hedge) {
        case HedgeType.Slightly:
          result = Math.pow(result, 1.0 / 3.0) // cube root
          break
        case HedgeType.Somewhat:
          result = Math.sqrt(result)
          break
        case HedgeType.Very:
          result = result * result
          break
        case HedgeType.Extremely:
          result = result * result * result
          break
        default:
          break
      }

      if (condition.not) {
        result = 1.0 - result
      }

      return result
    }

    throw new Error('Internal exception')
  }

  /**
   *
   * @param {number} cond1
   * @param {number} cond2
   * @param {OperatorType} op
   */
  evaluateConditionPair (cond1, cond2, op) {
    if (op === OperatorType.And) {
      if (this._andMethod === AndMethod.Min) {
        return Math.min(cond1, cond2)
      }
      if (this._andMethod === AndMethod.Production) {
        return cond1 * cond2
      }
      throw new Error('Internal error')
    }
    if (op === OperatorType.Or) {
      if (this._orMethod === OrMethod.Max) {
        return Math.max(cond1, cond2)
      }
      if (this._orMethod === OrMethod.Probabilistic) {
        return cond1 + cond2 - cond1 * cond2
      }
      throw new Error('Internal error.')
    }
    throw new Error('Internal error')
  }
}
