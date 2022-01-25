
export interface AddSurveyModel {
  question: string
  answers: AddSurveyItemModel[]
}

interface AddSurveyItemModel {
  image?: string
  answer: string
}

export interface AddSurvey {
  add(data: AddSurveyModel): Promise<void>
}
