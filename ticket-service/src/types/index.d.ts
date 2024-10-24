interface IResponse {
  [key: string]: number | string | object | Array<any>;
}
export {};

declare global {
  namespace Express {
    export interface Request {
      responseMessage?: IResponse;
    }
  }
}
