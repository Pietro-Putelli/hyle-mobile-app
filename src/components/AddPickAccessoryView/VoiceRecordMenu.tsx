import ChevronLeftIcon from '@/assets/icons/ChevronLeftIcon.svg';
import useProfile from '@/hooks/useProfile';
import useTheme from '@/hooks/useTheme';
import useVoiceRecognition from '@/hooks/useVoiceRecognition';
import {MotiView} from 'moti';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {IconButton, ScaleButton} from '../Buttons';
import LanguageSelector from '../LanguageSelector';
import LottieAnimation from '../LottieAnimation';
import MainText from '../MainText';
import {VoiceRecordMenuProp} from './types';

const lottieSource = require('../../assets/lotties/recording.json');

const X_HIDDEN = -400;

const VoiceRecordMenu = ({
  isVisible,
  stateProvider,
  onClosePress,
}: VoiceRecordMenuProp) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const {text, selection, setTextFromDictation} = stateProvider;

  const contentBeforeUpdate = useRef<string | null>(null);
  const startSelectionAt = useRef<number | null>(null);

  const {profile} = useProfile();
  const {appLanguage} = profile.settings;

  const [selectedLanguage, setSelectedLanguage] = useState(appLanguage);

  const {startRecognition, isRecording, stopRecognition, plainTextResult} =
    useVoiceRecognition();

  const recordingTitle = isRecording
    ? t('Common:recording')
    : t('Common:startRecording');

  const _stopRecognition = () => {
    stopRecognition();

    contentBeforeUpdate.current = null;
    startSelectionAt.current = null;
  };

  const _startRecognition = () => {
    startRecognition(selectedLanguage);

    contentBeforeUpdate.current = text;
    startSelectionAt.current = selection?.start ?? 0;
  };

  const onRecordingPress = () => {
    if (isRecording) {
      _stopRecognition();
    } else {
      _startRecognition();
    }
  };

  const onLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    contentBeforeUpdate.current = null;
    startSelectionAt.current = null;
  };

  const onLanguagePress = () => {
    if (isRecording) {
      _stopRecognition();
    }
  };

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        _startRecognition();
      }, 300);
    } else {
      stopRecognition();
    }
  }, [isVisible]);

  useEffect(() => {
    if (plainTextResult && contentBeforeUpdate.current != null) {
      const firstWord = plainTextResult.split(' ')[0];
      const updatedText =
        firstWord.toLowerCase() + plainTextResult.slice(firstWord.length);

      if (contentBeforeUpdate.current.length > 0) {
        setTextFromDictation({
          prev: contentBeforeUpdate.current,
          next: updatedText,
          start: startSelectionAt.current,
        });
      } else {
        setTextFromDictation({next: updatedText, start: 0});
      }
    }
  }, [plainTextResult]);

  const animatedRecordStyle = useAnimatedStyle(() => {
    return {
      borderWidth: withTiming(isRecording ? 1.5 : 0),
    };
  });

  return (
    <MotiView
      transition={{damping: 18}}
      from={{translateX: X_HIDDEN}}
      animate={{translateX: isVisible ? 12 : X_HIDDEN}}
      style={[{backgroundColor: theme.colors.background}, styles.container]}>
      <View style={styles.content}>
        <ScaleButton
          onPress={onRecordingPress}
          activeScale={0.98}
          style={[
            {
              ...theme.styles.cell,
              borderColor: theme.colors.accent,
              ...styles.recording,
              justifyContent: 'center',
            },
            animatedRecordStyle,
          ]}
          outerStyle={{flex: 1}}>
          <LottieAnimation
            isActive={isRecording}
            source={lottieSource}
            isThemeSensitive
            style={{
              width: 20,
              height: 20,
              transform: [{scale: 1.5}, {rotate: '-90deg'}],
            }}
          />

          <MainText size={16}>{recordingTitle}</MainText>
        </ScaleButton>

        <LanguageSelector
          style={styles.language}
          menuTitle={t('Common:changeVoiceLanguage')}
          type="secondary"
          onChange={onLanguageChange}
          onPress={onLanguagePress}
          defaultLanguage={selectedLanguage}
        />
      </View>

      <View style={{marginRight: -6}}>
        <IconButton onPress={onClosePress} isHaptic icon={ChevronLeftIcon} />
      </View>
    </MotiView>
  );
};

export default VoiceRecordMenu;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    top: 12,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 8,
    gap: 16,
  },
  recording: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 18,
    paddingHorizontal: 20,
    flex: 1,
    gap: 12,
  },
  language: {
    padding: 10,
    borderRadius: 18,
  },
});
