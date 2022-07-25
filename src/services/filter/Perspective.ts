const Perspective = require('perspective-api-client')

export const perspectiveApiClient = new Perspective({
  apiKey: process.env.PERSPECTIVE_API_KEY,
})

export async function getPerspectiveAnalysis(input: string) {
  const response = await perspectiveApiClient.analyze({
    comment: {
      text: input,
    },
    languages: ['en'],
    requestedAttributes: {
      TOXICITY: {},
      PROFANITY: {},
      SEXUALLY_EXPLICIT: {},
    },
  })

  return new PerspectiveAnalysisResult(input, response)
}

export class PerspectiveAnalysisResult {
  public readonly filter = 'perspectiveApi'

  public readonly sexuallyExplicitScore: number;
  public readonly profanityScore: number;
  public readonly toxicityScore: number;

  constructor(
    public readonly subject: string,
    public readonly response: AnalysisResponse
  ) {
    this.sexuallyExplicitScore = response.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value * 100
    this.profanityScore = response.attributeScores.PROFANITY.summaryScore.value * 100
    this.toxicityScore = response.attributeScores.TOXICITY.summaryScore.value * 100
  }

  shouldTextBeFiltered() {
    return this.isTextSexuallyExplicit() || this.isTextProfane()
  }

  shouldTextBeLogged() {
    const scores = [this.sexuallyExplicitScore, this.profanityScore, this.toxicityScore]

    return scores.some(score => score > 60)
  }

  isTextSexuallyExplicit() {
    return this.sexuallyExplicitScore >= 90
  }

  isTextProfane() {
    return this.profanityScore >= 90
  }

  isTextToxic() {
    return this.toxicityScore >= 90
  }
}

interface AnalysisResponse {
  attributeScores: {[key in AnalysisAttribute]: AnalysisAttributeScore};
}

type AnalysisAttribute =
  | 'TOXICITY'
  | 'PROFANITY'
  | 'SEXUALLY_EXPLICIT'

interface AnalysisAttributeScore {
  summaryScore: AnalysisSummaryScore;
}

interface AnalysisSummaryScore {
  value: number;
  type: string;
}
