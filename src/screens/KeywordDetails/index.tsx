import CloseIcon from '@/assets/icons/CloseIcon.svg';
import AdvancedList from '@/components/AdvancedList';
import AnimatedCellWrapper from '@/components/AdvancedList/AnimatedCellWrapper';
import IconProvider from '@/components/IconProvider';
import KeywordDefinition from '@/components/KeywordDefinition';
import ScrollDotsIndicator from '@/components/ScrollDotsIndicator';
import {getPickAnnotations} from '@/storage/slices/booksSlice';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useCallback, useMemo} from 'react';
import {
  Dimensions,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {SlideInDown, useSharedValue} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import styles from './styles';

const {width, height} = Dimensions.get('window');

const KeywordDetails = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const scrollX = useSharedValue(0);
  const route = useRoute<any>();

  const {bookId, pickId, selectedPart} = route?.params;

  const annotations = useSelector(state => {
    return getPickAnnotations(state, bookId, pickId);
  });

  const selectedIndex = useMemo(() => {
    const findIndex = annotations.findIndex((annotation: any) => {
      return annotation.content === selectedPart;
    });

    const index = findIndex === -1 ? 0 : findIndex;
    scrollX.value = index * width;

    return index;
  }, [selectedPart]);

  const dismiss = () => {
    navigation.goBack();
  };

  const renderItem = useCallback(
    ({item, index}: any) => {
      return (
        <AnimatedCellWrapper
          selected={selectedIndex}
          index={index}
          scrollX={scrollX}>
          <KeywordDefinition annotation={{...item, bookId, pickId}} />
        </AnimatedCellWrapper>
      );
    },
    [selectedIndex, route.params],
  );

  return (
    <>
      <StatusBar barStyle="light-content" />

      <TouchableWithoutFeedback onPress={dismiss}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.container}>
        <View style={{height: insets.top}} />

        <View style={styles.body}>
          <View style={{height: height * 0.75}}>
            <AdvancedList
              horizontal
              itemSize={width}
              scrollX={scrollX}
              pagingEnabled
              renderItem={renderItem}
              data={annotations}
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={selectedIndex}
              getItemLayout={(_, index) => {
                return {length: width, offset: width * index, index};
              }}
            />
          </View>

          <ScrollDotsIndicator count={annotations.length} scrollX={scrollX} />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={dismiss}
          style={[styles.footer, {paddingBottom: insets.bottom}]}>
          <Animated.View
            entering={SlideInDown.springify().damping(18)}
            style={{transform: [{scale: 1.2}]}}>
            <IconProvider Icon={CloseIcon} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default KeywordDetails;
