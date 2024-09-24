import {AxiosRequestConfig, AxiosResponse} from 'axios';
import {Dispatch} from 'redux';

type CallbackResponseParams<T> = {
  response?: AxiosResponse<T>;
  error?: any;
};

export type CallbackResponse<T> = (response: CallbackResponseParams<T>) => void;

export type PostParams = {
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
};

export type GetParams = {
  url: string;
  config?: AxiosRequestConfig;
};

export type DeleteParams = {
  url: string;
  params?: any;
  config?: AxiosRequestConfig;
};

export type MiddlewareDispatch = Dispatch<any>;
