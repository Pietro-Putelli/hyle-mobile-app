import {updateProfile} from '@/storage/slices/profileSlice';
import {store} from '@/storage/store';
import appleAuth from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {
  CreateTokenParams,
  CreateTokenResponse,
  CreateTokenResponseCallback,
} from '../types/auth';
import {AuthUrls} from '../urls';

class AuthAPI {
  static #createToken = async (
    {token, data, provider}: CreateTokenParams,
    callback: (response: CreateTokenResponse) => void,
  ) => {
    const deviceID = await DeviceInfo.getUniqueId();
    const {deviceToken} = store.getState().profileSlice;

    axios
      .post(AuthUrls.CreateToken, {
        token,
        data,
        device: {id: deviceID, token: deviceToken},
        provider,
      })
      .then(response => {
        const data = response.data;

        callback({loginMethod: provider, ...data});
      })
      .catch(error => {
        callback(null);
        console.log('[Create Auth Token Error]: ', error);
      });
  };

  static google = async (callback: CreateTokenResponseCallback) => {
    GoogleSignin.configure();

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const token = userInfo.idToken;

      if (token != null) {
        this.#createToken({token, provider: 'google'}, callback);
      }
    } catch (error) {
      callback(null);

      console.log('[Google Signin Error]: ', error);
    }
  };

  static apple = async (callback: CreateTokenResponseCallback) => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        const {authorizationCode, fullName} = appleAuthRequestResponse;

        if (authorizationCode != null) {
          this.#createToken(
            {
              token: authorizationCode,
              data: {
                given_name: fullName?.givenName,
                family_name: fullName?.familyName,
              },
              provider: 'apple',
            },
            callback,
          );
        }
      }
    } catch (error) {
      callback(null);
      console.log('[Apple Signin Error]: ', error);
    }
  };

  /* Refresh Token */
  static refreshToken = (
    token: string,
    callback: (accessToken: string | null) => void,
  ) => {
    axios
      .post(AuthUrls.RefreshToken, null, {
        headers: {Authorization: token},
      })
      .then(response => {
        const {access_token, refresh_token} = response.data;

        store.dispatch(
          updateProfile({
            accessToken: access_token,
            refreshToken: refresh_token,
          }),
        );

        callback(access_token);
      })
      .catch(error => {
        console.log('[Refresh Token Error]: ', error);
      });
  };
}

export default AuthAPI;
