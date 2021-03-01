export const KEYWORDS = ['if', 'then', 'is', 'and', 'or', 'not', '(', ')', 'slightly', 'somewhat', 'very', 'extremely']

/**
 * Check the name of variable/term.
 * @param {String} name
 */
export function isValidName (name) {
  //
  // Empty names are not allowed
  //
  const nameLength = name.length
  if (nameLength === 0) {
    return false
  }

  //
  // Only letters, numbers or '_' are allowed
  //
  if (/^\w+$/.test(name) === false) {
    return false
  }

  //
  // Identifier cannot be a keword
  //
  let isValid = true
  for (const kw of KEYWORDS) {
    if (name === kw) {
      isValid = false
      break
    }
  }
  return isValid
}
