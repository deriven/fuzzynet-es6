import * as NameHelper from './NameHelper'
import * as HedgeType from '../enums/HedgeType'
import * as OperatorType from '../enums/OperatorType'
import SingleCondition from './SingleCondition'
import FuzzyCondition from './FuzzyCondition'
import Conditions from './Conditions'
import ConditionExpression from './ConditionExpression'
import KeywordLexem from './KeywordLexem'
import TermLexem from './TermLexem'
import VarLexem from './VarLexem'

export default class RuleParser {
  /**
   *
   * @param {FuzzyVariable[]} input
   * @param {NamedValue[]} output
   * @returns {Map<string, Lexem>}
   */
  static buildLexemsList (input, output) {
    const lexems = new Map()

    for (const kw of NameHelper.KEYWORDS) {
      const keywordLexem = new KeywordLexem(kw)
      lexems.set(keywordLexem.text, keywordLexem)
    }

    for (const inputVar of input) {
      RuleParser.buildLexemsList2(inputVar, true, lexems)
    }

    for (const outputVar of output) {
      RuleParser.buildLexemsList2(outputVar, false, lexems)
    }

    return lexems
  }

  /**
   *
   * @param {NamedVariable} namedVar
   * @param {boolean} input
   * @param {Map<string, Lexem>} lexems
   */
  static buildLexemsList2 (namedVar, input, lexems) {
    const varLexem = new VarLexem(namedVar, input)
    lexems.set(varLexem.text, varLexem)

    for (const term of namedVar.values) {
      const termLexem = new TermLexem(term, input)

      if (lexems.has(termLexem.text) === false) {
        // there are no lexemsx with the same text. just insert new lexem
        lexems.set(termLexem.text, termLexem)
      } else {
        let foundLexem = lexems.get(termLexem.text)
        if (foundLexem instanceof TermLexem) {
          //
          // There can be more than one terms with the same name.
          // TODO: But only if they belong to different variables.
          //
          while (foundLexem.alternative !== null) {
            foundLexem = foundLexem.alternative
          }
          foundLexem.alternative = termLexem
        } else {
          //
          // Only terms of different vatiables can have the same name
          //
          throw new Error(`Found more than one lexems with the same name: ${termLexem.text}`)
        }
      }
    }
  }

  /**
   *
   * @param {string} rule
   * @param {Map<string, Lexem>} lexems
   * @returns {IExpression[]}
   */
  static parseLexems (rule, lexems) {
    const expressions = []

    const words = rule.split(' ')
    for (const word of words) {
      if (lexems.has(word)) {
        expressions.push(lexems.get(word))
      } else {
        throw new Error(`Unknown identifier: ${word}`)
      }
    }

    return expressions
  }

  /**
   *
   * @param {IExpression[]} conditionExpression
   * @param {Map<string, Lexem>} lexems
   * @returns {IExpression[]}
   */
  static extractSingleConditions (conditionExpression, lexems) {
    let copyExpressions = conditionExpression.slice(0)
    const expressions = []

    while (copyExpressions.length > 0) {
      if (copyExpressions[0] instanceof VarLexem) {
        // parse variable
        const varLexem = copyExpressions[0]
        if (copyExpressions.length < 3) {
          throw new Error(`Condition strated with '${varLexem.text}' is incorrect.`)
        }

        if (varLexem.input === false) {
          throw new Error('The variable in condition part must be an input variable.')
        }

        // parse 'is' lexem

        const exprIs = copyExpressions[1]
        if (exprIs !== lexems.get('is')) {
          throw new Error(`'is' keyword must go after ${varLexem.text} identifier.`)
        }

        // parse 'not' lexem (if exists)
        let cur = 2
        let not = false
        if (copyExpressions[cur] === lexems.get('not')) {
          not = true
          cur++

          if (copyExpressions.length <= cur) {
            throw new Error('Error at \'not\' in condition part of the rule.')
          }
        }

        // slightly
        // somewhat
        // very
        // extremely

        //
        // Parse hedge modifier (if exists)
        //
        let hedge = HedgeType.None
        if (copyExpressions[cur] === lexems.get('slightly')) {
          hedge = HedgeType.Slightly
        } else if (copyExpressions[cur] === lexems.get('somewhat')) {
          hedge = HedgeType.Somewhat
        } else if (copyExpressions[cur] === lexems.get('very')) {
          hedge = HedgeType.Very
        } else if (copyExpressions[cur] === lexems.get('extremely')) {
          hedge = HedgeType.Extremely
        }

        if (hedge !== HedgeType.None) {
          cur++

          if (copyExpressions.length <= cur) {
            throw new Error(`Error at '${hedge}' in condition part of the rule.`)
          }
        }

        //
        // Parse term
        //
        const exprTerm = copyExpressions[cur]
        if ((exprTerm instanceof TermLexem) === false) {
          throw new Error(`Wrong identifier '${exprTerm.text}' in conditional part of the rule.`)
        }

        let altLexem = exprTerm
        let termLexem = null
        do {
          if (!(altLexem instanceof TermLexem)) {
            continue
          }

          termLexem = altLexem
          if (varLexem.namedVar.values.indexOf(termLexem.term) < 0) {
            termLexem = null
            continue
          }
        } while ((altLexem = altLexem.alternative) !== null && termLexem === null)

        if (termLexem == null) {
          throw new Error(`Wrong identifier '${exprTerm.text}' in conditional part of the rule.`)
        }

        //
        // Add new condition expression
        //
        const condition = new FuzzyCondition(varLexem.namedVar, termLexem.term, not, hedge)
        expressions.push(new ConditionExpression(copyExpressions.slice(0, cur + 1), condition))
        copyExpressions = copyExpressions.slice(cur + 1)
      } else {
        const expr = copyExpressions[0]
        if (expr === lexems.get('and') ||
          expr === lexems.get('or') ||
          expr === lexems.get('(') ||
          expr === lexems.get(')')) {
          expressions.push(expr)
          copyExpressions = copyExpressions.slice(1)
        } else {
          const unknownLexem = expr
          throw new Error(`Lexem '${unknownLexem.text}' found at the wrong place in condition part of the rule.`)
        }
      }
    }

    return expressions
  }

  /**
   *
   * @param {IExpression[]} conditionExpression
   * @param {Map<string, Lexem>} lexems
   * @returns {Conditions}
   */
  static parseConditions (conditionExpression, lexems) {
    // Extract single conditions
    const expressions = RuleParser.extractSingleConditions(conditionExpression, lexems)

    if (expressions.length === 0) {
      throw new Error('No valid conditions found in conditions part of the rule.')
    }

    const cond = RuleParser.parseConditionsRecurse(expressions, lexems)

    // Return conditions
    if (cond instanceof Conditions) {
      return cond
    }
    return new Conditions()
  }

  /**
   *
   * @param {IExpression[]} expressions
   * @param {Map<string, lexem>} lexems
   * @returns{number}
   */
  static findPairBracket (expressions, lexems) {
    // Assume that '(' stands at first place

    let bracketsOpened = 1
    let closeBracket = -1
    for (let i = 1; i < expressions.length; i++) {
      if (expressions[i] === lexems.get('(')) {
        bracketsOpened++
      } else if (expressions[i] === lexems.get(')')) {
        bracketsOpened--
        if (bracketsOpened === 0) {
          closeBracket = i
          break
        }
      }
    }

    return closeBracket
  }

  /**
   *
   * @param {IExpression[]} expressions
   * @param {Map<string, Lexem>} lexems
   * @returns {ICondition}
   */
  static parseConditionsRecurse (expressions, lexems) {
    if (expressions.length < 1) {
      throw new Error('Empty condition found.')
    }

    if (expressions[0] === lexems.get('(') && this.findPairBracket(expressions, lexems) === expressions.length) {
      // Remove extra brackets
      return RuleParser.parseConditionsRecurse(expressions.slice(1, 1 + expressions.length - 2), lexems)
    }
    if (expressions.length === 1 && expressions[0] instanceof ConditionExpression) {
      // Return single condition
      return expressions[0].condition
    }

    // Parse list of one level conditions connected by or/and
    let copyExpressions = expressions.slice(0)
    const conds = new Conditions()
    let setOrAnd = false
    while (copyExpressions.length > 0) {
      let cond = null
      if (copyExpressions[0] === lexems.get('(')) {
        // Find pair bracket
        const closeBracket = RuleParser.findPairBracket(copyExpressions, lexems)
        if (closeBracket === -1) {
          throw new Error('Parenthesis error')
        }

        cond = RuleParser.parseConditionsRecurse(copyExpressions.slice(1, 1 + closeBracket - 1), lexems)
        copyExpressions = copyExpressions.slice(closeBracket + 1)
      } else if (copyExpressions[0] instanceof ConditionExpression) {
        cond = copyExpressions[0]._condition
        copyExpressions = copyExpressions.slice(1)
      } else {
        throw new Error(`Wrong expression in condition part at '${copyExpressions[0].text}`)
      }

      // And condition to the list
      conds.conditionsList.push(cond)

      if (copyExpressions.length > 0) {
        if (copyExpressions[0] === lexems.get('and') || copyExpressions[0] === lexems.get('or')) {
          if (copyExpressions.length < 2) {
            throw new Error(`Error at ${copyExpressions[0].text} in condition part.`)
          }

          // Set and/or for conditions list
          const newOp = (copyExpressions[0] === lexems.get('and')) ? OperatorType.And : OperatorType.Or

          if (setOrAnd) {
            if (conds.op !== newOp) {
              throw new Error('At the one nesting level cannot be mixed and/or operations.')
            }
          } else {
            conds.op = newOp
            setOrAnd = true
          }
          copyExpressions = copyExpressions.slice(1)
        } else {
          throw new Error(`${copyExpressions[1].text} cannot go after ${copyExpressions[0].text}`)
        }
      }
    }
    return conds
  }

  /**
   *
   * @param {IExpression[]} conditionExpression
   * @param {Map<string, Lexem>} lexems
   * @returns {SingleCondition}
   */
  static parseConclusion (conditionExpression, lexems) {
    let copyExpression = conditionExpression.slice(0)

    // Remove extra brackets
    while (copyExpression.length >= 2 &&
    (copyExpression[0] === lexems.get('(') &&
      copyExpression[copyExpression.length - 1] === lexems.get(')'))) {
      copyExpression = copyExpression.slice(1, 1 + copyExpression.length - 2)
    }

    if (copyExpression.length !== 3) {
      throw new Error('Conclusion part of the rule should be in form: \'variable is term\'')
    }

    // Parse variable
    const exprVariable = copyExpression[0]
    if (!(exprVariable instanceof VarLexem)) {
      throw new Error(`Wrong identifier '${exprVariable.text}' in conclusion part of the rule.`)
    }

    const varLexem = exprVariable
    if (varLexem.input === true) {
      throw new Error('The variable in conclusion part must be an output variable.')
    }

    // Parse 'is' lexem
    const exprIs = copyExpression[1]
    if (exprIs !== lexems.get('is')) {
      throw new Error(`'is' keyword must go after ${varLexem.text} identifier.`)
    }

    // Parse term
    const exprTerm = copyExpression[2]
    if (!(exprTerm instanceof TermLexem)) {
      throw new Error(`Wrong identifier '${exprTerm.text}' in conclusion part of the rule.`)
    }

    let altLexem = exprTerm
    let termLexem = null
    do {
      if (!(altLexem instanceof TermLexem)) {
        // TODO: might be redundant
        continue
      }

      termLexem = altLexem
      if (!varLexem.namedVar.values.indexOf(termLexem.term) < 0) {
        termLexem = null
        continue
      }
    } while ((altLexem = altLexem.alternative) !== null && termLexem === null)

    if (termLexem === null) {
      throw new Error(`Wrong identifier '${exprTerm.text}' in conclusion part of the rule.`)
    }

    // Return fuzzy rule's conclusion
    return new SingleCondition(varLexem.namedVar, termLexem.term, false)
  }

  /**
   *
   * @param {string} rule
   * @param {GenericFuzzyRule} emptyRule
   * @param {FuzzyVariable[]} input
   * @param {NamedVariable[]} output
   * @returns {GenericFuzzyRule}
   */
  static parse (rule, emptyRule, input, output) {
    if (rule.length === 0) {
      throw new Error('Rule cannot be empty.')
    }

    // Surround brakes with spaces, remove double spaces
    const sb = []
    for (const ch of rule) {
      if (ch === ')' || ch === '(') {
        if (sb.length > 0 && sb[sb.length - 1] === ' ') {
          // Do not duplicate spaces
        } else {
          sb.push(' ')
        }

        sb.push(ch)
        sb.push(' ')
      } else {
        if (ch === ' ' && sb.length > 0 && sb[sb.length - 1] === ' ') {
          // do not duplicate spaces
        } else {
          sb.push(ch)
        }
      }
    }

    // Remove spaces
    const prepRule = sb.join('').trim()

    // Build lexems dictionary
    const lexemsDict = RuleParser.buildLexemsList(input, output)

    // At first we parse lexems
    const expressions = RuleParser.parseLexems(prepRule, lexemsDict)
    if (expressions.length === 0) {
      throw new Error('No valid identifiers found.')
    }

    // Find condition & conclusion parts part
    if (expressions[0] !== lexemsDict.get('if')) {
      throw new Error('\'if\' should be the first identifier.')
    }

    let thenIndex = -1
    for (let i = 1; i < expressions.length; i++) {
      if (expressions[i] === lexemsDict.get('then')) {
        thenIndex = i
        break
      }
    }

    if (thenIndex === -1) {
      throw new Error('\'then\' identifier not found.')
    }

    const conditionLen = thenIndex - 1
    if (conditionLen < 1) {
      throw new Error('Condition part of the rule not found.')
    }

    const conclusionLen = expressions.length - thenIndex - 1
    if (conclusionLen < 1) {
      throw new Error('Conclusion part of the rule not found.')
    }

    const conditionExpressions = expressions.slice(1, 1 + conditionLen)
    const conclusionExpressions = expressions.slice(thenIndex + 1, thenIndex + 1 + conclusionLen)

    const conditions = RuleParser.parseConditions(conditionExpressions, lexemsDict)
    const conclusion = RuleParser.parseConclusion(conclusionExpressions, lexemsDict)

    emptyRule.condition = conditions
    emptyRule.conclusion = conclusion
    return emptyRule
  }
}
