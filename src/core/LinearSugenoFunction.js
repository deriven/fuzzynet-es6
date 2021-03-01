import NamedValue from './NamedValue'

/**
 * Linear function for Sugeno Fuzzy System (can be created via SugenoFuzzySystem.createSugenoFunction methods
 */
export default class extends NamedValue {
  /**
   * Constructor
   * @param {String} name Name of the value
   * @param {FuzzyVariable[]} input
   * @param {Map|Number[]} [coeffs]
   * @param {number} [constValue=0.0]
   */
  constructor (name, input, coeffs, constValue) {
    super(name)
    this._input = input
    this._coeffs = new Map()
    if (coeffs) {
      if (coeffs instanceof Map) {
        // Check that all coeffecients are related to the variable from input
        for (const key of coeffs.keys()) {
          if (this._input.indexOf(key) < 0) {
            throw new Error('Input of the fuzzy system does not contain ' + key.name + ' variable.')
          }
        }
        // Initialize members
        this._coeffs = coeffs
        this._constValue = constValue // required
      }
      if (coeffs instanceof Array) {
        const inputLength = this._input.length
        // Check input values
        if (coeffs.length !== inputLength && coeffs.length !== inputLength + 1) {
          throw new Error('Wrong length of coefficients\' array')
        }
        // Fill list of coefficients
        let i = 0
        for (i; i < inputLength; i++) {
          this._coeffs.set(this._input[i], coeffs[i])
        }

        if (coeffs.length === inputLength + 1) {
          this._constValue = coeffs[coeffs.length - 1]
        }
      }
    }
  }

  /**
   * @returns {number} Constant coefficient
   */
  get constValue () {
    return this._constValue
  }

  /**
   * Set constant coefficient
   * @param {number} val
   */
  set constValue (val) {
    this._constValue = val
  }

  /**
   * Get coefficient by fuzzy variable
   * @param {FuzzyVariable} fuzVar Fuzzy variable
   * @returns {number} Coefficient's value
   */
  getCoefficient (fuzVar) {
    if (fuzVar) {
      return this._coeffs.get(fuzVar)
    }
    return this._constValue
  }

  /**
   * Set coefficient by fuzzy variable
   * @param {FuzzyVariable} fuzVar Fuzzy variable
   * @param {number} coeff New value of the coefficient
   */
  setCoefficient (fuzVar, coeff) {
    if (fuzVar) {
      this._coeffs.set(fuzVar, coeff)
    } else {
      this._constValue = coeff
    }
  }

  /**
   * Calculate result of linear function
   * @param {Map<FuzzyVariable, number>} inputValues Input values
   * @returns {number} Result of the calculation
   */
  evaluate (inputValues) {
    // NOTE: input values should be validated here
    let result = 0.0

    for (const key of this._coeffs.keys()) {
      result += this._coeffs.get(key) * inputValues.get(key)
    }
    result += this._constValue

    return result
  }
}
