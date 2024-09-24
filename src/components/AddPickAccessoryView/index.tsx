import DoneIcon from '@/assets/icons/DoneIcon.svg';
import MagicIcon from '@/assets/icons/MagicIcon.svg';
import MicIcon from '@/assets/icons/MicIcon.svg';
import PasteIcon from '@/assets/icons/PasteIcon.svg';
import RightArrowIcon from '@/assets/icons/RightArrowIcon.svg';
import TextInputIcon from '@/assets/icons/TextInputIcon.svg';
import RouteNames from '@/constants/routeNames';
import useAppState from '@/hooks/useAppState';
import useTheme from '@/hooks/useTheme';
import PicturePreview from '@/screens/PicturePreview';
import {InputModes} from '@/types/InputMode';
import {openImagePicker} from '@/utils/imagepicker';
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
import {useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';
import {ContextMenuButton} from 'react-native-ios-context-menu';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import {ActionButton, IconButton} from '../Buttons';
import TextSelectionMenu from './TextSelectionMenu';
import VoiceRecordMenu from './VoiceRecordMenu';
import {getInputMethodsMenuConfig} from './options';
import styles from './styles';
import {AddPickAccessoryViewProps} from './types';

const AddPickAccessoryView = ({
  hasSegue,
  isMicActive,
  setIsMicActive,
  onInputPress,
  onActionPress,
  isMenuVisible,
  isEditMenuVisible,
  isEnrichTextButtonDisabled,
  onTextSelectionActionPress,
  onDonePress,
  onTextCopiedFromAsset,
  stateProvider,
  isDoneButtonDisabled,
  isLoading,
  isEnrichingText,
  onEnrichTextPress,
}: AddPickAccessoryViewProps) => {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const navigation = useNavigation<any>();
  const {t} = useTranslation();

  const [isPasteButtonVisible, setIsPasteButtonVisible] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<any>(null);
  const isPreviewVisible = currentAsset !== null;

  const inputMenuOptions = useMemo(() => {
    return getInputMethodsMenuConfig({
      current: isMicActive ? InputModes.Mic : InputModes.Text,
    });
  }, [isMicActive]);

  const onPressMenuItem = ({nativeEvent}: any) => {
    const actionKey = nativeEvent.actionKey;

    onInputPress(actionKey);

    switch (actionKey) {
      case InputModes.Scan:
        navigation.navigate(RouteNames.Camera);
        break;
      case InputModes.Gallery:
        openImagePicker(setCurrentAsset);
        break;
      default:
        break;
    }
  };

  /* Effects */

  useAppState(async () => {
    const hasString = await Clipboard.hasString();
    setIsPasteButtonVisible(hasString);
  });

  return (
    <>
      <View
        style={[
          styles.container,
          theme.styles.hairlineTop,
          {backgroundColor: theme.colors.background},
        ]}>
        {!isMicActive && (
          <TextSelectionMenu
            isMenuVisible={isMenuVisible}
            isEditMenuVisible={isEditMenuVisible}
            onActionPress={onTextSelectionActionPress}
          />
        )}

        {isMicActive && (
          <VoiceRecordMenu
            stateProvider={stateProvider}
            isVisible={isMicActive}
            onClosePress={() => {
              setIsMicActive(false);
            }}
          />
        )}

        <View style={{flex: 1}}>
          <ScrollView
            ref={scrollRef}
            showsHorizontalScrollIndicator={false}
            horizontal
            keyboardShouldPersistTaps="always"
            style={{flexDirection: 'row'}}>
            {isPasteButtonVisible && (
              <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                <ActionButton
                  action={{
                    title: t('Actions:paste'),
                    icon: PasteIcon,
                  }}
                  onPress={() => {
                    onActionPress('paste');
                  }}
                  isHaptic
                />
              </Animated.View>
            )}

            <ActionButton
              isLoading={isEnrichingText}
              fullLoadingDuration={4000}
              onPress={() => {
                onEnrichTextPress();

                scrollRef.current?.scrollToEnd({animated: true});
              }}
              action={{
                title: t('AddNewPick:enrichContent'),
                icon: MagicIcon,
                key: 'enrich',
              }}
              disabled={isEnrichTextButtonDisabled}
              loadingText={t('AddNewPick:doingMagic')}
            />
          </ScrollView>
        </View>

        <View style={{paddingLeft: 12, flexDirection: 'row', gap: 12}}>
          <ContextMenuButton
            onPressMenuItem={onPressMenuItem}
            isMenuPrimaryAction
            menuConfig={inputMenuOptions}>
            <IconButton
              side={48}
              type="secondary"
              isActive={!isMicActive}
              states={[
                {icon: TextInputIcon, type: 'primary'},
                {icon: MicIcon, type: 'secondary'},
              ]}
            />
          </ContextMenuButton>

          <IconButton
            side={48}
            type="primary"
            isLoading={isLoading}
            icon={hasSegue ? RightArrowIcon : DoneIcon}
            isHaptic
            onPress={onDonePress}
            disabled={isEnrichingText || isDoneButtonDisabled}
          />
        </View>
      </View>

      {currentAsset && (
        <PicturePreview
          selectedAsset={currentAsset}
          isVisible={isPreviewVisible}
          onBackPress={() => {
            setCurrentAsset(null);
          }}
          onNextPress={() => {
            onTextCopiedFromAsset?.();

            setTimeout(() => {
              setCurrentAsset(null);
            }, 1000);
          }}
        />
      )}
    </>
  );
};

export default AddPickAccessoryView;
