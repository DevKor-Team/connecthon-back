export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface ServiceResult<T = undefined> {
  data?: T;
}
