import * as ImplicationMethod from '../enums/ImplicationMethod'
import * as AggregationMethod from '../enums/AggregationMethod'
import * as DefuzzificationMethod from '../enums/DefuzzificationMethod'
import * as MfCompositionType from '../enums/MfCompositionType'
import GenericFuzzySystem from './GenericFuzzySystem'
import CompositeMembershipFunction from './CompositeMembershipFunction'
import ConstantMembershipFunction from './ConstantMembershipFunction'
import MamdaniFuzzyRule from './MamdaniFuzzyRule'
import RuleParser from './RuleParser'

/**
 * Mamdani fuzzy inference system
 */
export default class extends GenericFuzzySystem {
  /**
   * Default constructor
   */
  constructor () {
    super()
    this._output = []
    this._rules = []
    this._implMethod = ImplicationMethod.Min
    this._aggrMethod = AggregationMethod.Max
    this._defuzzMethod = DefuzzificationMethod.Centroid
  }

  /**
   * @returns {Array<FuzzyVariable>} Output linguistic variables
   */
  get output () {
    return this._output
  }

  /**
   * @returns {Array<MamdaniFuzzyRule>} Fuzzy rules
   */
  get rules () {
    return this._rules
  }

  /**
   * @returns {string} Implication method
   */
  get implicationMethod () {
    return this._implicationMethod
  }

  /**
   * Implication method
   * @param {string} val
   */
  set implicationMethod (val) {
    this._implicationMethod = val
  }

  /**
   * @returns {string} Aggregation method
   */
  get aggrMethod () {
    return this._aggrMethod
  }

  /**
   * Aggregation method
   * @param {string} val
   */
  set aggrMethod (val) {
    this._aggrMethod = val
  }

  /**
   * @returns {string} Defuzzification method
   */
  get defuzzMethod () {
    return this._defuzzMethod
  }

  /**
   * Defuzzification method
   * @param {string} val
   */
  set defuzzMethod (val) {
    this._defuzzMethod = val
  }

  /**
   * Get output linguistic variable by its name
   * @param {string} name Variable's name
   * @returns {FuzzyVariable} Found variable
   */
  outputByName (name) {
    var returnVar
    for (const outputVar of this._output) {
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
   * @returns {MamdaniFuzzyRule}
   */
  emptyRule () {
    return new MamdaniFuzzyRule()
  }

  /**
   * Parse rule from the string
   * @param {string} rule String containing the rule
   * @returns {MamdaniFuzzyRule}
   */
  parseRule (rule) {
    return RuleParser.parse(rule, this.emptyRule(), this._input, this._output)
  }

  /**
   * Calculate output values
   * @param {Map<FuzzyVariable, number>} inputValues Input values (format: variable - value)
   * @returns {Map<FuzzyVariable, number} Output values (format: variable - value)
   */
  calculate (inputValues) {
    // there should be one rule as minimum
    if (this._rules.length === 0) {
      throw new Error('There should be one rule as minimum')
    }

    // fuzzification step
    const fuzzifiedInput = this.fuzzify(inputValues)

    // evaluate the conditions
    const evaluatedConditions = this.evaluateConditions(fuzzifiedInput)

    // do implication for each rule
    const implicatedConclusions = this.implicate(evaluatedConditions)

    // aggregate the results
    const fuzzyResult = this.aggregate(implicatedConclusions)

    // defuzzify the result
    const result = this.defuzzify(fuzzyResult)

    return result
  }

  /**
   * Evaluate conditions
   * @param {Map<FuzzyVariable, Map<FuzzyTerm, number>>} fuzzifiedInput Input in fuzzified form
   * @returns {Map<MamdaniFuzzyRule, number>} Result of evaluation
   */
  evaluateConditions (fuzzifiedInput) {
    const result = new Map()
    for (const rule of this._rules) {
      result.set(rule, this.evaluateCondition(rule.condition, fuzzifiedInput))
    }

    return result
  }

  /**
   * Implicate rule results
   * @param {Map<MamdaniFuzzyRule, number>} conditions Rule conditions
   * @returns {Map<MamdaniFuzzyRule, IMembershipFunction>} Implicated conclusion
   */
  implicate (conditions) {
    const conclusions = new Map()
    for (const rule of conditions.keys()) {
      var compType
      switch (this._implMethod) {
        case ImplicationMethod.Min:
          compType = MfCompositionType.Min
          break
        case ImplicationMethod.Production:
          compType = MfCompositionType.Prod
          break
        default:
          throw new Error('Internal error')
      }

      const resultMf = new CompositeMembershipFunction(compType, [
        new ConstantMembershipFunction(conditions.get(rule)),
        rule.conclusion.term.membershipFunction])

      conclusions.set(rule, resultMf)
    }

    return conclusions
  }

  /**
   * Aggregate rules
   * @param {Map<MamdaniFuzzyRile, IMembershipFunction>} conclusions Rules' results
   * @returns {Map<FuzzyVariable, IMembershipFunction} Aggregated fuzzy result
   */
  aggregate (conclusions) {
    const fuzzyResult = new Map()
    for (const outputVar of this._output) {
      const mfList = []
      for (const rule of conclusions.keys()) {
        if (rule.conclusion.namedVar === outputVar) {
          mfList.push(conclusions.get(rule))
        }
      }

      var composType
      switch (this._aggrMethod) {
        case AggregationMethod.Max:
          composType = MfCompositionType.Max
          break
        case AggregationMethod.Sum:
          composType = MfCompositionType.Sum
          break
        default:
          throw new Error('Internal exception')
      }
      fuzzyResult.set(outputVar, new CompositeMembershipFunction(composType, mfList))
    }

    return fuzzyResult
  }

  /**
   * Calculate crisp result for each rule
   * @param {Map<FuzzyVariable, IMembershipFunction>} fuzzyResult
   */
  defuzzify (fuzzyResult) {
    const crispResult = new Map()
    for (const fuzzyVar of fuzzyResult.keys()) {
      crispResult.set(fuzzyVar, this.defuzzifyMembershipFunction(fuzzyResult.get(fuzzyVar), fuzzyVar.min, fuzzyVar.max))
    }

    return crispResult
  }

  /**
   *
   * @param {IMembershipFunction} mf
   * @param {number} min
   * @param {number} max
   */
  defuzzifyMembershipFunction (mf, min, max) {
    if (this._defuzzMethod === DefuzzificationMethod.Centroid) {
      const k = 50
      const step = (max - min) / k

      //
      // Calculate a center of gravity as integral
      //
      // let ptLeft = 0.0
      let ptCenter = 0.0
      let ptRight = 0.0

      let valLeft = 0.0
      let valCenter = 0.0
      let valRight = 0.0

      let val2Left = 0.0
      let val2Center = 0.0
      let val2Right = 0.0

      let numerator = 0.0
      let denominator = 0.0

      for (let i = 0; i < k; i++) {
        if (i === 0) {
          ptRight = min
          valRight = mf.getValue(ptRight)
          val2Right = ptRight * valRight
        }

        // ptLeft = ptRight
        ptCenter = min + step * (i + 0.5)
        ptRight = min + step * (i + 1)

        valLeft = valRight
        valCenter = mf.getValue(ptCenter)
        valRight = mf.getValue(ptRight)

        val2Left = val2Right
        val2Center = ptCenter * valCenter
        val2Right = ptRight * valRight

        numerator += step * (val2Left + 4 * val2Center + val2Right) / 3.0
        denominator += step * (valLeft + 4 * valCenter + valRight) / 3.0
      }

      return numerator / denominator
    } else if (this._defuzzMethod === DefuzzificationMethod.Bisector) {
      // TODO:
      throw new Error('Bisector not supported')
    } else if (this._defuzzMethod === DefuzzificationMethod.AverageMaximum) {
      // TODO:
      throw new Error('Average Maximum not supported')
    } else {
      throw new Error('Internal exception.')
    }
  }
}
