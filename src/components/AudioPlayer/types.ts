export type AudioPlayerProps = {
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  onSkipPress: (position: 'next' | 'prev') => void;
};
