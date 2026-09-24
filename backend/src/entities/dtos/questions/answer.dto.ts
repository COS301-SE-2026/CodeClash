export interface AnswerDTO{
    answer: string,
    question_id: string
  format: AnswerFormat | null // for prog matches 
  precision: number | null
}

export enum AnswerFormat {
  Numeric = "numeric",
  Decimal = "decimal",
  Set = "set",
  Variables = "variables",
  Expression = "expression",
  Simplified = "simplified",
  Factored = "factored",
  Equation = "equation"
}