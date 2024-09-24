import CloseIcon from '@/assets/icons/CloseIcon.svg';
import RightArrowIcon from '@/assets/icons/RightArrowIcon.svg';
import AdvancedList from '@/components/AdvancedList';
import {MainButton} from '@/components/Buttons';
import MainText from '@/components/MainText';
import ScrollDotsIndicator from '@/components/ScrollDotsIndicator';
import usePhotoHistory from '@/hooks/usePhotoHistory';
import React, {useCallback, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, Modal, StatusBar, View} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Picture from './Picture';
import styles from './styles';
import {PicturePreviewProps} from './types';

const {width} = Dimensions.get('window');

const PicturePreview = ({
  selectedAsset,
  isVisible,
  onBackPress,
  onNextPress,
}: PicturePreviewProps) => {
  const insets = useSafeAreaInsets();
  const scrollX = useSharedValue(0);
  const {t} = useTranslation();

  const {photos, appendPhotoToHistory} = usePhotoHistory();

  const scrollIndex = useMemo(() => {
    let index = Math.max(photos.length - 1, 0);

    if (selectedAsset != undefined) {
      index = photos.findIndex(photo => photo.id === selectedAsset.id);
    }

    scrollX.value = index * width;

    return index;
  }, [selectedAsset, photos]);

  const renderItem = useCallback(
    ({item}: any) => {
      return <Picture pictureId={item.id} />;
    },
    [photos],
  );

  useEffect(() => {
    if (selectedAsset) {
      appendPhotoToHistory(selectedAsset);
    }
  }, [selectedAsset]);

  return (
    <Modal
      visible={isVisible}
      transparent
      presentationStyle="overFullScreen"
      animationType="fade">
      <StatusBar barStyle="light-content" />

      <View style={[styles.container, {paddingTop: insets.top}]}>
        <View style={styles.header}>
          <MainText
            size={15}
            style={{marginVertical: 16, paddingHorizontal: 8}}
            align="center"
            color={'#d9d9d990'}>
            {t('Common:tapTheImageToSelectText')}
          </MainText>
        </View>

        <View style={{flex: 1}}>
          <View style={{height: (4 / 2.9) * width}}>
            <AdvancedList
              scrollEnabled={photos.length > 1}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              horizontal
              data={photos}
              scrollX={scrollX}
              keyExtractor={(_, index: number) => index.toString()}
              renderItem={renderItem}
              contentOffset={{x: scrollIndex * width, y: 0}}
            />
          </View>

          <View style={{marginTop: 16, alignItems: 'center'}}>
            <ScrollDotsIndicator count={photos.length} scrollX={scrollX} />
          </View>
        </View>

        <View
          style={{
            width: '100%',
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 24,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
            }}>
            <MainButton
              title={t('Actions:undo')}
              type="secondary"
              leftIcon={CloseIcon}
              onPress={onBackPress}
            />

            <MainButton
              isHaptic
              title={t('Actions:done')}
              type="primary"
              rightIcon={RightArrowIcon}
              onPress={onNextPress}
              outerStyle={{flex: 1}}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PicturePreview;
