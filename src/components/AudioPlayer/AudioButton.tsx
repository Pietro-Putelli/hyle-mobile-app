import PauseIcon from '@/assets/icons/PauseIcon.svg';
import PlayIcon from '@/assets/icons/PlayIcon.svg';
import {MotiView} from 'moti';
import {memo} from 'react';
import {ScaleButton} from '../Buttons';
import IconProvider from '../IconProvider';

const AudioButton = ({isPlaying, onPress}: any) => {
  return (
    <ScaleButton
      onPress={() => {
        onPress(isPlaying ? 'pause' : 'play');
      }}
      isHaptic
      style={
        {
          // transform: [{scale: 0.9}],
        }
      }>
      <MotiView
        animate={{
          scale: !isPlaying ? 1 : 0,
        }}
        transition={{
          type: !isPlaying ? 'spring' : 'timing',
        }}>
        <IconProvider Icon={PlayIcon} />
      </MotiView>

      <MotiView
        animate={{
          scale: isPlaying ? 1 : 0,
        }}
        style={{
          position: 'absolute',
        }}>
        <IconProvider Icon={PauseIcon} />
      </MotiView>
    </ScaleButton>
  );
};

export default memo(AudioButton);
