import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { GlobalUserRequestProps, RequestSender, SendRequestProps } from "../config";


function senderBuilder(a: AxiosInstance): RequestSender<any, AxiosResponse<any>> {
  return ({ method, url, headers, body, updateProgress }: SendRequestProps<any>) => {

    // const request = new Request({
    //   url,
    //   headers: new Headers(headers),

    // });

    const config: AxiosRequestConfig<any> = {
      responseType: "json",
      headers,
      onDownloadProgress: (e: ProgressEvent) => {
        if (e.lengthComputable) {
          updateProgress(e.loaded / e.total)
        }
      }
    }

    switch (method) {
      case "get": {
        return a.get(url, config);
      }
      case "post": {
        return a.post(url, body ?? undefined, config);
      }
      case "put": {
        return a.put(url, body ?? undefined, config);
      }
      case "patch": {
        return a.patch(url, body ?? undefined, config);
      }
      case "delete": {
        return a.delete(url, config);
      }
      default: {
        throw new Error("Unknow")
      }
    }
  }
}


async function payloadTransFormer(res: AxiosResponse<any>) {
  return res.data;
}


function axiosPreset(a: AxiosInstance): GlobalUserRequestProps<any, any, any> {
  return {
    sendRequest: senderBuilder(a),
    payloadTransFormer,
    errorHandler: async (e: AxiosError) => {
      if (e.isAxiosError) {
        return e.message;
      } else {
        return e.message;
      }
    },
  }
}


export {
  axiosPreset,
}
