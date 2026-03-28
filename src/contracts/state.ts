export const PIPELINE_STATES = [
  'INGESTED',
  'TRANSFERRED',
  'REWRITTEN',
  'IMAGED',
  'FILLED',
  'DONE',
] as const

export const FAILURE_STATES = [
  'FAILED_TRANSFER',
  'FAILED_REWRITE',
  'FAILED_IMAGE',
  'FAILED_FILL',
] as const

export const SUCCESS_STATES = ['DONE'] as const

export type PipelineState = (typeof PIPELINE_STATES)[number]
export type FailureState = (typeof FAILURE_STATES)[number]
