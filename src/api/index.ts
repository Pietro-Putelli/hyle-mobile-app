import {getUserTokens} from '@/storage/store';
import axios, {AxiosInstance} from 'axios';
import 'core-js/stable/atob';
import {jwtDecode} from 'jwt-decode';
import AuthAPI from './routes/auth';
import {CallbackResponse, DeleteParams, GetParams, PostParams} from './types';
import {BaseUrl} from './urls';

class ApiHandler {
  private static instance: ApiHandler;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: BaseUrl,
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  public static getInstance(): ApiHandler {
    if (!ApiHandler.instance) {
      ApiHandler.instance = new ApiHandler();
    }
    return ApiHandler.instance;
  }

  public post<T>(
    {url, data, config}: PostParams,
    callback: CallbackResponse<T>,
  ) {
    this.axiosInstance
      .post<T>(url, data, config)
      .then(response => {
        callback({response});
      })
      .catch(error => {
        callback({error});
      });
  }

  public get<T>({url, config}: GetParams, callback: CallbackResponse<T>) {
    this.axiosInstance
      .get<T>(url, config)
      .then(response => {
        callback({response});
      })
      .catch(error => {
        callback({error});
      });
  }

  public put<T>(
    {url, data, config}: PostParams,
    callback: CallbackResponse<T>,
  ) {
    this.axiosInstance
      .put<T>(url, data, config)
      .then(response => {
        callback({response});
      })
      .catch(error => {
        callback({error});
      });
  }

  public patch<T>(
    {url, data, config}: PostParams,
    callback: CallbackResponse<T>,
  ) {
    this.axiosInstance
      .patch<T>(url, data, config)
      .then(response => {
        callback({response});
      })
      .catch(error => {
        callback({error});
      });
  }

  public delete = <T>(
    {url, params, config}: DeleteParams,
    callback: CallbackResponse<T>,
  ) => {
    this.axiosInstance
      .delete<T>(url, {params, ...config})
      .then(response => {
        callback({response});
      })
      .catch(error => {
        callback({error});
      });
  };

  private updateAuthorization = (accessToken: string) => {
    console.log('Updating accessToken', accessToken);

    this.axiosInstance.interceptors.request.use(
      config => {
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
      },
      null,
      {synchronous: true},
    );
  };

  /* Use to update and refresh token when the app is launched */

  public updateInstance(callback: () => void) {
    const {accessToken, refreshToken} = getUserTokens();

    if (accessToken != undefined && refreshToken != undefined) {
      /* Since redux is loaded async, always update the token */

      this.updateAuthorization(accessToken);

      const {exp} = jwtDecode(accessToken);

      if (exp != undefined) {
        const currentTime = Math.floor(Date.now() / 1000);
        const isExpired = exp < currentTime;

        /* Check if accessToken is expired */

        if (isExpired) {
          AuthAPI.refreshToken(refreshToken, accessToken => {
            if (accessToken != null) {
              this.updateAuthorization(accessToken);
              callback();
            }
          });
        } else {
          callback();
        }
      }
    }
  }
}

const apiHandler = ApiHandler.getInstance();

export default apiHandler;
