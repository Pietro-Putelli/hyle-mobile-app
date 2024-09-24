import {PickProps} from '@/types/Book';
import {createSlice} from '@reduxjs/toolkit';
import {unionBy} from 'lodash';
// import {Track} from 'react-native-track-player';

type AudioPlayerProps = {
  // track: Track | null;
  pick: PickProps | null;
  isPlaying: boolean;
  isDownloading?: boolean;
};

type UtilityStateProps = {
  // audioPlayer: AudioPlayerProps;
  photosHistory: any[];
};

const initialState: UtilityStateProps = {
  photosHistory: [],
  // audioPlayer: {
  //   track: null,
  //   pick: null,
  //   isPlaying: false,
  //   isDownloading: false,
  // },
};

const utilitySlice = createSlice({
  name: 'utility',
  initialState,
  reducers: {
    setStateAudioPlayer: (state, action) => {
      // state.audioPlayer = {
      //   ...state.audioPlayer,
      //   ...action.payload,
      // };
    },

    /* Photos History Logic */

    appendStatePhotoToHistory: (state, action) => {
      /* Add up to 9 photos */
      state.photosHistory = unionBy(
        [action.payload],
        state.photosHistory,
        'id',
      ).slice(0, 9);
    },

    removeStatePhotoFromHistory: (state, action) => {
      state.photosHistory = state.photosHistory.filter(
        photo => photo.id !== action.payload.id,
      );
    },

    flushUtilityState: state => {
      state.photosHistory = [];
    },
  },
});

export const {
  appendStatePhotoToHistory,
  removeStatePhotoFromHistory,
  flushUtilityState,
} = utilitySlice.actions;

export const getStateAudioPlayer = (state: any): AudioPlayerProps => {
  return state.utilitySlice.audioPlayer;
};

export const getPhotosHistory = (state: any): any[] => {
  return state.utilitySlice.photosHistory;
};

export default utilitySlice.reducer;
