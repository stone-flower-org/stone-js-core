export enum ProcessingStatus {
  ERROR = 'error',
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
}

export const isErrorStatus = (status: unknown): status is ProcessingStatus.ERROR => status === ProcessingStatus.ERROR;
export const isIdleStatus = (status: unknown): status is ProcessingStatus.IDLE => status === ProcessingStatus.IDLE;
export const isLoadingStatus = (status: unknown): status is ProcessingStatus.LOADING =>
  status === ProcessingStatus.LOADING;
export const isSuccessStatus = (status: unknown): status is ProcessingStatus.SUCCESS =>
  status === ProcessingStatus.SUCCESS;
export const isLoadedStatus = (status: unknown): status is ProcessingStatus.SUCCESS | ProcessingStatus.ERROR =>
  status === ProcessingStatus.SUCCESS || status === ProcessingStatus.ERROR;
