import {createSelector, createSlice} from '@reduxjs/toolkit';
import moment from 'moment';

export type ProfileSettings = {
  darkMode: boolean;

  /* The app language is the language the app is currently using */
  appLanguage?: string;

  /* The default translation language */
  secondLanguage: string;

  notificationEnabled: boolean;
  notificationMode: string;
};

type ProfileState = {
  accessToken?: string;
  refreshToken?: string;

  guid?: string;
  email?: string;
  familyName?: string;
  givenName?: string;
  loginMethod?: 'apple' | 'google';
  isPremium?: boolean;

  settings: ProfileSettings;

  /* 
    The sessionID is generated every time the user logs in, and it's used to keep track of the user's session. Use it to update the deviceToken when the user logs in or notification permission is granted.
   */
  sessionID?: string;

  /*
    Token Registered For Push Notifications. It's registered only once in the life of the app, so keep it even if user logged out
  */
  deviceToken?: string;

  /*
    Use this field to store the last time the function check_user was called. The function verifies if the user is still a legitimate user and has not been banned or deleted, and checks if the user is still a premium user.
  */
  lastHealthCheck?: string;

  /* Since the token is generated only once, use this for different sessions */
  isDeviceTokenRegistered: boolean;
};

const initialSettings: ProfileSettings = {
  darkMode: true,
  /* Detectect at the first start and set the app language */
  appLanguage: undefined,
  secondLanguage: 'en',
  notificationEnabled: true,
  notificationMode: 'all',
};

const initialState: ProfileState = {
  accessToken: undefined,
  refreshToken: undefined,

  guid: undefined,
  email: undefined,
  familyName: undefined,
  givenName: undefined,
  loginMethod: undefined,
  isPremium: false,

  settings: initialSettings,
  sessionID: undefined,
  lastHealthCheck: undefined,

  deviceToken: undefined,
  isDeviceTokenRegistered: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      const data = action.payload;

      const {access_token, refresh_token} = data.auth;

      state.accessToken = access_token;
      state.refreshToken = refresh_token;

      const {
        email,
        family_name,
        given_name,
        guid,
        is_premium,
        session_id,
        settings,
      } = data.user;

      state.guid = guid;
      state.email = email;
      state.familyName = family_name;
      state.givenName = given_name;
      state.loginMethod = data.loginMethod;
      state.isPremium = is_premium;

      if (settings) {
        const {appLanguage, secondLanguage, ...rest} = settings;

        if (appLanguage != '') {
          state.settings.appLanguage = appLanguage;

          if (appLanguage == 'it') {
            state.settings.secondLanguage = 'en';
          }
        }

        state.settings = {
          ...state.settings,
          ...rest,
        };
      }

      state.sessionID = session_id;

      /* On first login, the profile health is already check */
      state.lastHealthCheck = moment().format();
    },

    updateProfile: (state, action) => {
      const data = action.payload;

      Object.entries(data).forEach(([key, value]) => {
        (state as any)[key] = value;
      });
    },

    setDeviceToken: (state, action) => {
      state.deviceToken = action.payload;
      state.isDeviceTokenRegistered = true;
    },

    updateProfileSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    },

    setDefaultSettings: state => {
      state.settings = initialSettings;
    },

    flushProfileState: state => {
      state.accessToken = undefined;
      state.refreshToken = undefined;

      state.guid = undefined;
      state.email = undefined;
      state.familyName = undefined;
      state.givenName = undefined;
      state.loginMethod = undefined;
      state.isPremium = false;
      state.settings = initialSettings;

      state.sessionID = undefined;
      state.lastHealthCheck = undefined;
      state.isDeviceTokenRegistered = false;
    },
  },
});

export const {
  setUserProfile,
  updateProfile,
  setDeviceToken,
  updateProfileSettings,
  flushProfileState,
  setDefaultSettings,
} = profileSlice.actions;

export const getProfileState = (state: any): ProfileState => state.profileSlice;

export const getIsUserLogged = (state: any) => {
  const {accessToken} = getProfileState(state);

  return accessToken != undefined;
};

export const getProfileSettings = createSelector<any, ProfileSettings>(
  getProfileState,
  profileState => profileState.settings,
);

export default profileSlice.reducer;
