import { Nullable } from "./utils";


export type RequestMethod = "get" | "post" | "put" | "patch" | "delete";


export type HeaderProps = { [key: string]: string };


export interface SendRequestProps<B> {
  method: RequestMethod;
  url: string;
  body: Nullable<B>;
  headers: HeaderProps;
  updateProgress: (r: number) => any;
}


export type RequestSender<B, R> = (props: SendRequestProps<B>) => Promise<R>;


export class UseRequestNotConfigError extends Error {
  constructor() {
    super();
    this.message = "The useRequest must be configurated before being used. ";
  }
}


export interface GlobalUserRequestProps<B, P, R> {
  sendRequest: RequestSender<B, R>;
  payloadTransFormer: (res: R) => Promise<P>;
  errorHandler: (error: any) => Promise<any>;
}


export let globalUseRequestConfig: GlobalUserRequestProps<any, any, any> | null = null;


const configUseRequest = (props: GlobalUserRequestProps<any, any, any>) => {
  globalUseRequestConfig = props;
}


export default configUseRequest;
