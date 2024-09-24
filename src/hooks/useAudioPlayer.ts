// import {
//   getStateAudioPlayer,
//   setStateAudioPlayer,
// } from '@/storage/slices/utilitySlice';
// import {PickProps} from '@/types/Book';
// import getTextToSpeechFromOpenAI from '@/utils/textToSpeech';
// import {useEffect, useMemo} from 'react';
// import TrackPlayer, {
//   Event,
//   RepeatMode,
//   Track,
//   useIsPlaying,
//   useProgress,
//   useTrackPlayerEvents,
// } from 'react-native-track-player';
// import {useDispatch, useSelector} from 'react-redux';
// import useSettings from './useSettings';

// type VoidCallback = () => void;
// type NewPositionCallback = (position: number) => void;

// type SetTrackProps = {
//   track: Track;
//   pick: PickProps;
// };

// function format(seconds: number) {
//   let mins = parseInt((seconds / 60).toString())
//     .toString()
//     .padStart(2, '0');

//   let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');

//   return `${mins}:${secs}`;
// }

// const useAudioPlayer = () => {
//   const dispatch = useDispatch();

//   const settings = useSettings();

//   const {track, pick, isDownloading} = useSelector(getStateAudioPlayer);
//   const hasTrack = track !== null;

//   const {playing} = useIsPlaying();
//   const isPlaying = playing as boolean;

//   // const [isPlaying, setIsPlaying] = useState(false);

//   const progress = useProgress();

//   useTrackPlayerEvents([Event.RemotePlay, Event.RemotePause], async event => {
//     // setIsPlaying(event.type === Event.RemotePlay);
//   });

//   const playAudio = async () => {
//     TrackPlayer.play();
//   };

//   const pauseAudio = async () => {
//     TrackPlayer.pause();
//   };

//   const stopAudio = async () => {
//     await TrackPlayer.reset();

//     dispatch(
//       setStateAudioPlayer({track: null, pick: null, isDownloading: false}),
//     );
//   };

//   const seekToPosition = (position: number, callback: VoidCallback) => {
//     TrackPlayer.seekTo(position).then(callback);
//   };

//   const skipForValue = (callback: NewPositionCallback) => {
//     const newPosition = Math.min(progress.position + 10, progress.duration);

//     seekToPosition(newPosition, () => {
//       callback(newPosition);
//     });
//   };

//   const prevForValue = (callback: NewPositionCallback) => {
//     const newPosition = Math.max(progress.position - 10, 0);
//     seekToPosition(newPosition, () => {
//       callback(newPosition);
//     });
//   };

//   const setTrack = ({track, pick}: SetTrackProps) => {
//     TrackPlayer.add([track])
//       .then(() => {
//         dispatch(setStateAudioPlayer({track, pick}));
//       })
//       .catch(error => {
//         console.log('[Track Player] Error:', error);
//       });
//   };

//   const skipToPick = (pick: PickProps) => {
//     dispatch(setStateAudioPlayer({track: {}, pick}));
//   };

//   const setIsDownloading = (isDownloading: boolean) => {
//     dispatch(setStateAudioPlayer({isDownloading}));
//   };

//   const readPick = async ({book, pick}: any) => {
//     setIsDownloading(true);

//     getTextToSpeechFromOpenAI({pick, settings}, async url => {
//       if (url != null) {
//         setIsDownloading(false);

//         setTrack({
//           pick,
//           track: {
//             url: url,
//             title: book.title,
//           },
//         });
//       }
//     });
//   };

//   const formattedDuration = useMemo(() => {
//     return `${format(progress.position)}`;
//   }, [progress]);

//   useEffect(() => {
//     TrackPlayer.setRepeatMode(RepeatMode.Off);
//   }, []);

//   useEffect(() => {
//     if (!track) {
//       // setIsPlaying(false);
//     }
//   }, [track]);

//   return {
//     track,
//     pick,
//     readPick,
//     isPlaying,
//     isDownloading,
//     hasTrack,
//     progress: progress,
//     formattedDuration,

//     playAudio,
//     pauseAudio,
//     stopAudio,

//     skipToPick,
//     seekToPosition,
//     skipForValue,
//     prevForValue,
//   };
// };

// export default useAudioPlayer;
