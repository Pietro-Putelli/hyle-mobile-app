import {updateProfile} from '@/storage/slices/profileSlice';
import {store} from '@/storage/store';
import moment from 'moment';
import apiHandler from '../';
import ErrorHandler from '../error';
import {MiddlewareDispatch} from '../types';
import {ProfileUrls} from '../urls';
import {logout} from '../utils';

const errorHandler = new ErrorHandler('ProfileAPI');

class ProfileAPI {
  static #getProfileData = () => {
    return store.getState().profileSlice;
  };

  static updateSession = (deviceToken: string, callback: () => void) => {
    const {sessionID} = this.#getProfileData();

    apiHandler.patch(
      {
        url: ProfileUrls.Session,
        data: {
          guid: sessionID,
          device_token: deviceToken,
        },
      },
      response => {
        if (response == null) {
          errorHandler.newError('Failed to update session');
        } else {
          callback();
        }
      },
    );
  };

  static updateData = (data: any, callback: () => void) => {
    apiHandler.put({url: ProfileUrls.Me, data}, response => {
      if (response != null) {
        callback();
      } else {
        errorHandler.newError('Failed to update user data');
      }
    });
  };

  /*
    Use this function to check if the user is still a legitimate user and has not
    been banned or deleted, and check if the user is still a premium user.

    Returns => { is_premium, is_healthy}
  */

  static checkHealth =
    (callback: () => void) => (dispatch: MiddlewareDispatch) => {
      const {lastHealthCheck, isPremium} = this.#getProfileData();

      const now = moment();
      const lastCheckDate = moment(lastHealthCheck);

      if (now.diff(lastCheckDate, 'hours') < 12) {
        return;
      }

      apiHandler.get({url: ProfileUrls.Me}, ({response}: any) => {
        if (response != null) {
          const {is_premium, is_healthy} = response.data;

          if (!is_healthy) {
            errorHandler.newError('User is not healthy, logging out');

            this.logout(callback);
          } else {
            if (isPremium !== is_premium) {
              dispatch(
                updateProfile({
                  isPremium: is_premium,
                  lastHealthCheck: now.format(),
                }),
              );
            }
          }
        } else {
          errorHandler.newError('Failed to check user health');
        }
      });
    };

  /*
    Use this function to log out the user from the app and expire the session.
  */

  static logout = (callback: any) => (dispatch: MiddlewareDispatch) => {
    const {sessionID} = store.getState().profileSlice;

    apiHandler.delete(
      {
        url: ProfileUrls.Session,
        params: {guid: sessionID},
      },
      ({response, error}) => {
        if (response?.status === 204) {
          dispatch(logout());

          callback(true);
        } else {
          errorHandler.newError(error);
        }
      },
    );
  };
}

export default ProfileAPI;
