import GenericFuzzySystem from './GenericFuzzySystem'
import SugenoFuzzyRule from './SugenoFuzzyRule'
import LinearSugenoFunction from './LinearSugenoFunction'
import RuleParser from './RuleParser'

/**
 * Sugeno fuzzy inference system
 */
export default class extends GenericFuzzySystem {
  /**
   * Default constructor
   */
  constructor () {
    super()
    this._output = []
    this._rules = []
  }

  /**
   * @returns {Array<SugenoVariable>} Output linguistic variables
   */
  get output () {
    return this._output
  }

  /**
   * @returns {Array<SugenoFuzzyRule>} Fuzzy rules
   */
  get rules () {
    return this._rules
  }

  /**
   * Get output linguistic variable by its name
   * @param {string} name Variable's name
   * @returns {SugenoVariable} Found variable
   */
  outputByName (name) {
    var returnVar
    for (let outputVar of this._output) {
      if (outputVar.name === name) {
        returnVar = outputVar
        break
      }
    }
    if (returnVar) {
      return returnVar
    }

    throw new Error('Key not found')
  }

  /**
   * Create new empty rule
   * @returns {SugenoFuzzyRule}
   */
  emptyRule () {
    return new SugenoFuzzyRule()
  }

  /**
   * Use this method to create a linear function for the Sugeno fuzzy system
   * @param {string} name Name of the function
   * @param {Array|Map<FuzzyVariable, number>} coeffs List of coefficients. List length must be less or equal to the input length
   * @param {number} [constValue]
   * @returns {LinearSugenoFunction} Created function
   */
  createSugenoFunction (name, coeffs, constValue) {
    return new LinearSugenoFunction(name, this._input, coeffs, constValue)
  }

  /**
   * Use this method to create rule by its textual representation
   * @param {string} rule Rule in text form
   * @returns {SugenoFuzzyRule} Created rule
   */
  parseRule (rule) {
    return RuleParser.parse(rule, this.emptyRule(), this._input, this._output)
  }

  /**
   * Calculate output of fuzzy system
   * @param {Map<FuzzyVariable, number>} inputValues Input values
   * @returns {Map<SugenoVariable, number} Output values
   */
  calculate (inputValues) {
    // there should be one rule as minimum
    if (this._rules.length === 0) {
      throw new Error('There should be one rule as minimum')
    }

    // fuzzification step
    let fuzzifiedInput = this.fuzzify(inputValues)

    // evaluate the conditions
    let ruleWeights = this.evaluateConditions(fuzzifiedInput)

    // functions evaluation
    let functionsResult = this.evaluateFunctions(inputValues)

    // combine output
    let result = this.combineResult(ruleWeights, functionsResult)

    return result
  }

  /**
   * Evaluate conditions
   * @param {Map<FuzzyVariable, Map<FuzzyTerm, number>>} fuzzifiedInput Input in fuzzified form
   * @returns {Map<SugenoFuzzyRule, number>} Result of evaluation
   */
  evaluateConditions (fuzzifiedInput) {
    let result = new Map()
    for (let rule of this._rules) {
      result.set(rule, this.evaluateCondition(rule.condition, fuzzifiedInput))
    }

    return result
  }

  /**
   * Calculate functions' results
   * @param {Map<FuzzyVariable, number>} inputValues Input values
   * @returns {Map<SugenoVariable, Map<LinearSugenoFunction, number>>} Results
   */
  evaluateFunctions (inputValues) {
    let result = new Map()
    for (let outputVar of this._output) {
      var varResult = new Map()
      for (let func of outputVar.functions) {
        varResult.set(func, func.evaluate(inputValues))
      }

      result.set(outputVar, varResult)
    }

    return result
  }

  /**
   * Combine results of functions and rule evaluation
   * @param {Map<SugenoFuzzyRule, number>} ruleWeights Rule weights (results of evaluation)
   * @param {Map<SugenoVariable, Map<LinearSugenoFunction, number>>} functionResults Result of functions evaluation
   * @returns Result of calculations
   */
  combineResult (ruleWeights, functionResults) {
    let numerators = new Map()
    let denominators = new Map()
    let results = new Map()

    // Calculate numerator and denominator separately for each output
    for (let outputVar of this._output) {
      numerators.set(outputVar, 0.0)
      denominators.set(outputVar, 0.0)
    }

    for (let rule of ruleWeights.keys()) {
      let conclusionVar = rule.conclusion.namedVar
      let z = functionResults.get(conclusionVar).get(rule.conclusion.term)
      let w = ruleWeights.get(rule)

      numerators.set(conclusionVar, numerators.get(conclusionVar) + (z * w))
      denominators.set(conclusionVar, denominators.get(conclusionVar) + w)
    }

    // calculate the fractions
    for (let outputVar of this._output) {
      if (denominators.get(outputVar) === 0.0) {
        results.set(outputVar, 0.0)
      } else {
        results.set(outputVar, numerators.get(outputVar) / denominators.get(outputVar))
      }
    }

    return results
  }
}
