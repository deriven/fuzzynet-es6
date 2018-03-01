import NamedBase from './NamedBase'

/**
 * Named variable
 */
export default class extends NamedBase {
  /**
   * @abstract
   * @returns {Array<NamedBase>} Named values
   */
  get values () {}
}
