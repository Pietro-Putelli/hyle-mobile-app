import {Tuple, configureStore} from '@reduxjs/toolkit';
import * as FileSystem from 'expo-file-system';
import {pick} from 'lodash';
import {combineReducers} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import {createExpoFileSystemStorage} from 'redux-persist-expo-file-system-storage';
import createSensitiveStorage from 'redux-persist-sensitive-storage';
import {thunk} from 'redux-thunk';
import {booksSlice, editPickSlice, profileSlice, utilitySlice} from './slices';
import {ReduxStorage} from './storage';
import {ConfigProps} from './types';

const createConfig = ({key, whitelist, blacklist}: ConfigProps) => {
  return {key, storage: ReduxStorage, whitelist, blacklist};
};

const encryptedStorage = createSensitiveStorage({
  keychainService: 'keychainService',
});

/* Filesystem persist reducers */

export const fileSystemStorage = createExpoFileSystemStorage({
  storagePath: `${FileSystem.documentDirectory}photosHistory/`,
  encoding: FileSystem.EncodingType.Base64,
});

const rootReducer = combineReducers({
  editPickSlice,
  utilitySlice: persistReducer(
    createConfig({key: 'utilitySlice', whitelist: ['photosHistory']}),
    utilitySlice,
  ),
  booksSlice: persistReducer(createConfig({key: 'booksSlice'}), booksSlice),
  profileSlice: persistReducer(
    {
      key: 'profileSlice',
      storage: encryptedStorage,
    },
    profileSlice,
  ),
  fileSystemStorage: persistReducer(
    {
      key: 'fileSystemStorage',
      storage: fileSystemStorage,
    },
    profileSlice,
  ),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: () => new Tuple(thunk),
});

export const persistor = persistStore(store);

export const getUserTokens = () => {
  return pick(store.getState().profileSlice, ['accessToken', 'refreshToken']);
};
