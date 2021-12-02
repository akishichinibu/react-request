import { useState, useCallback, useEffect } from "react";

import Logger from "src/logger";
import { Nullable } from "src/utils";
import { globalUseRequestConfig, GlobalUserRequestProps, HeaderProps, RequestMethod, UseRequestNotConfigError } from "src/config";


export enum RequestState {
  Pending = 1,
  Preparing = 2,
  Loading = 3,
  Success = 4,
  Error = 5,
}


export interface UseRequestProps<B=any, P=any, R=any> extends Partial<GlobalUserRequestProps<B, P, R>> {
  method: RequestMethod;
  initialUrl: Nullable<string>;
  headers?: HeaderProps;
  body?: B;

  logger?: Logger;
}


export interface RefreshProps<B> {
  newUrl?: string;
  newBody?: B;
  headersBuilder?: (old: HeaderProps) => HeaderProps;
}


function useRequest<B=any, P=any, R=any>(props: UseRequestProps<B, P, R>) {
  if (globalUseRequestConfig === null) {
    throw new UseRequestNotConfigError();
  }

  const logger = props.logger ?? console;

  const [url, setUrl] = useState(props.initialUrl);
  const [headers, setHeaders] = useState<HeaderProps>(props.headers ?? {});

  const [state, setState] = useState<RequestState>(props.initialUrl === null ? RequestState.Pending : RequestState.Preparing);
  const [body, setBody] = useState<Nullable<B>>(props.body ?? null);

  const [payload, setPayload] = useState<Nullable<P>>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<any>(null);

  const isLoading = (state === RequestState.Loading);
  const isComplete = (state === RequestState.Success || state === RequestState.Error);

  // send the request within the current context
  const send = useCallback(() => {
    if (url === null) {
      return;
    }

    if (isComplete) {
      logger.debug(`The request ${url} is done now and the process will be bypassed`);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const future = (props.sendRequest ?? globalUseRequestConfig!.sendRequest)({
      method: props.method,
      url,
      body,
      headers,
      updateProgress: setProgress,
    });

    setState(RequestState.Loading);

    future
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .then((res) => (props.payloadTransFormer ?? globalUseRequestConfig!.payloadTransFormer)(res))
      .then((data) => {
        setPayload(data);
        setProgress(1);
        setState(RequestState.Success);
      })
      .catch((e) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (props.errorHandler ?? globalUseRequestConfig!.errorHandler)(e)
          .then(setError)
          .finally(() => setState(RequestState.Error))
      });

  }, [body, headers, isComplete, logger, props, url]);


  const refresh = useCallback((props?: RefreshProps<B>) => {
    if (isLoading) {
      logger.warn(`The request ${url} is progressing now so that it can not be refreshed. `);
      return;
    }
    const { newUrl, newBody, headersBuilder } = props ?? {};

    if (newUrl === undefined) {
      if (url === null) {
        logger.error(`The current url is null, and a newUrl must be provided for refresh the request`);
        return;
      }
    } else {
      setUrl(newUrl);
    }

    headersBuilder && setHeaders(headersBuilder(headers))
    newBody && setBody(newBody);
    setError(null);
    setProgress(0);
    setState(RequestState.Preparing);
  }, [headers, isLoading, logger, url]);

  useEffect(() => {
    if (state !== RequestState.Preparing) {
      logger.debug(`The request [${props.method}] ${url} isn't in preparing status now and the process will be bypassed`);
      return;
    }
    send();
  }, [state, props.method, url, logger, send]);

  return {
    url,
    state,
    isLoading,

    payload,
    error,
    progress,

    refresh,
  }
}


export default useRequest;
