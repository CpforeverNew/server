import blacklist from './blacklist.json'
import { getPerspectiveAnalysis } from './Perspective'

export async function getFilterResultByText(input: string): Promise<InputFilterResult> {
  if (textMatchesBlacklist(input)) {
    return new StaticBlacklistResult(input)
  }

  return await getPerspectiveAnalysis(input)
}

function textMatchesBlacklist(input: string) {
  const words = input.toLowerCase().split(' ')

  return blacklist.some(swearWord => words.some(word => word === swearWord))
}

/**
 * The result of an `InputFilterService`'s analysis of some text
 */
export interface InputFilterResult {
  /**
   * The analyzed text that this object represents
   */
  readonly subject: string;

  /**
   * The name of the filter that flagged the text
   */
  readonly filter: string;

  shouldTextBeLogged(): boolean;
  shouldTextBeFiltered(): boolean;
}

export class StaticBlacklistResult {
  public readonly filter = 'blacklist'

  constructor(public subject: string)
  {}

  shouldTextBeLogged() {
    return true
  }

  shouldTextBeFiltered() {
    return true
  }
}
