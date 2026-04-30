export interface Response<T> {
  data: T;
  status: boolean;
  message: string;
}