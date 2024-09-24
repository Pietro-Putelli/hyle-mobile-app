import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
  SpeechVolumeChangeEvent,
} from '@react-native-voice/voice';
import * as Haptics from 'expo-haptics';
import {useCallback, useEffect, useState} from 'react';

interface VoiceRecognitionState {
  isRecognized: boolean;
  pitch: number;
  error: string;
  results: string[];
  partialResults: string[];
  isRecording: boolean;
}

export type VoiceRecognitionHook = VoiceRecognitionState & {
  plainTextResult: string;
  startRecognition: (language?: string) => void;
  stopRecognition: () => void;
  cancelRecognition: () => void;
  destroyRecognition: () => void;
};

const VoiceRecognitionInitialState: VoiceRecognitionState = {
  isRecognized: false,
  pitch: 0,
  error: '',
  results: [],
  partialResults: [],
  isRecording: false,
};

const useVoiceRecognition = () => {
  const [state, setState] = useState<VoiceRecognitionState>(
    VoiceRecognitionInitialState,
  );

  const [isUserSpeaking, setIsUserSpeaking] = useState(false);

  /* Methods to handle voice recognition */

  const resetState = useCallback(() => {
    setState(VoiceRecognitionInitialState);
  }, [setState]);

  const startRecognition = useCallback(
    async (language?: string) => {
      resetState();

      const _language = language ?? 'en-US';

      try {
        await Voice?.start(_language);
      } catch (error) {
        console.log('[StartRecognition] Error: ', error);
      }
    },
    [resetState],
  );

  const stopRecognition = useCallback(async () => {
    try {
      if (state.isRecording) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      await Voice.stop();
    } catch (error) {
      console.log('[StopRecognition] Error: ', error);
    }
  }, [state.isRecording]);

  const cancelRecognition = useCallback(async () => {
    resetState();

    try {
      await Voice.cancel();
    } catch (error) {
      console.log('[CancelRecognition] Error: ', error);
    }
  }, [resetState]);

  const destroyRecognition = useCallback(async () => {
    try {
      await Voice.destroy();
    } catch (error) {
      console.log('[DestroyRecognition] Error: ', error);
    }

    resetState();
  }, [resetState]);

  /* Effects to handle voice recognition */

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setState(prevState => {
        return {...prevState, isRecording: true};
      });
    };

    Voice.onSpeechEnd = () => {
      setState(prevState => {
        return {...prevState, isRecording: false, pitch: 0};
      });
    };

    Voice.onSpeechRecognized = () => {
      setState(prevState => {
        return {...prevState, isRecognized: true};
      });
    };

    Voice.onSpeechError = (event: SpeechErrorEvent) => {
      setState(prevState => {
        return {
          ...prevState,
          error: JSON.stringify(event.error),
          isRecording: false,
          pitch: 0,
        };
      });
    };

    Voice.onSpeechResults = (event: SpeechResultsEvent) => {
      setState(prevState => {
        return {
          ...prevState,
          results: prevState.isRecording ? event.value! : [],
        };
      });
    };

    Voice.onSpeechPartialResults = (event: SpeechResultsEvent) => {
      setState(prevState => {
        return {
          ...prevState,
          partialResults: event.value!,
        };
      });
    };

    Voice.onSpeechVolumeChanged = (event: SpeechVolumeChangeEvent) => {
      const currentPitch = event.value!;

      setState(prevState => {
        return {...prevState, pitch: currentPitch};
      });
    };

    /* Clean up the event listeners when the component is unmounted */

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const plainTextResult = state.results.join(' ');
  const normalizedPitch = Math.round(state.pitch);

  useEffect(() => {
    setIsUserSpeaking(normalizedPitch > 1);
  }, [normalizedPitch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isUserSpeaking) {
        stopRecognition();
      }
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isUserSpeaking, stopRecognition]);

  return {
    ...state,
    plainTextResult,
    startRecognition,
    stopRecognition,
    cancelRecognition,
    destroyRecognition,
  };
};

export default useVoiceRecognition;
