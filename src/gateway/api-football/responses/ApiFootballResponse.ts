export class ApiFootballResponse<T> {
  get: string;
  parameters: any;
  errors: any[];
  results: number;
  paging: { current: number, total: number };
  response: T[];
}