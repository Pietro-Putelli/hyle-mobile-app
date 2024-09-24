import {flushBookState} from '@/storage/slices/booksSlice';
import {flushProfileState} from '@/storage/slices/profileSlice';
import {flushUtilityState} from '@/storage/slices/utilitySlice';
import {MiddlewareDispatch} from './types';
import {fileSystemStorage} from '@/storage/store';

export const logout = () => (dispatch: MiddlewareDispatch) => {
  dispatch(flushProfileState());
  dispatch(flushBookState());
  dispatch(flushUtilityState());

  fileSystemStorage.clear();
};
