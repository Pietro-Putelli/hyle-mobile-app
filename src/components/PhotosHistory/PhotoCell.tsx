import DeleteIcon from '@/assets/icons/DeleteIcon.svg';
import {fileSystemStorage} from '@/storage/store';
import {Image} from 'expo-image';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Animated, {
  FadeInLeft,
  FadeOutRight,
  LinearTransition,
} from 'react-native-reanimated';
import {ScaleButton} from '../Buttons';
import IconProvider from '../IconProvider';
import styles from './styles';

const PhotoCell = ({item, onPress, onRemovePress}: any) => {
  const [data, setData] = React.useState<any>(null);

  useEffect(() => {
    (async () => {
      const photo = await fileSystemStorage.getItem(item.id);
      setData(photo);
    })();
  }, [item]);

  return (
    <Animated.View
      entering={FadeInLeft}
      exiting={FadeOutRight}
      layout={LinearTransition.springify().damping(16)}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress(item)}
        disabled={data == null}
        style={styles.cell}>
        {data != null && (
          <Image
            source={{
              uri: `data:image/jpg;base64,${data}`,
            }}
            style={StyleSheet.absoluteFill}
          />
        )}
        {/* <MainText color="black">{item.id}</MainText> */}

        <View
          style={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            zIndex: 10,
          }}>
          <ScaleButton isHaptic onPress={() => onRemovePress(item)}>
            <IconProvider Icon={DeleteIcon} scale={1} color="#fff" />
          </ScaleButton>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default PhotoCell;
