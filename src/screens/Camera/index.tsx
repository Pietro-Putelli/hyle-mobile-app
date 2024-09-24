import CloseIcon from '@/assets/icons/CloseIcon.svg';
import FlashOffIcon from '@/assets/icons/FlashOffIcon.svg';
import FlashOnIcon from '@/assets/icons/FlashOnIcon.svg';
import GalleryIcon from '@/assets/icons/GalleryIcon.svg';
import HistoryIcon from '@/assets/icons/HistoryIcon.svg';
import {IconButton, ScaleButton} from '@/components/Buttons';
import {MainContainer} from '@/components/Containers';
import MainText from '@/components/MainText';
import PhotosHistory from '@/components/PhotosHistory';
import {CameraFlareView} from '@/components/Views';
import {CameraFlareViewRef} from '@/components/Views/CameraFlareView';
import RouteNames from '@/constants/routeNames';
import useDelayedEffect from '@/hooks/useDelayedEffect';
import usePhotoHistory from '@/hooks/usePhotoHistory';
import {openImagePicker} from '@/utils/imagepicker';
import Permissions from '@/utils/permissions';
import {generateUUID} from '@/utils/strings';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  useIsFocused,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import * as React from 'react';
import {useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StatusBar, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Camera as CameraComponent,
  TakePhotoOptions,
  useCameraDevice,
} from 'react-native-vision-camera';
import PicturePreview from '../PicturePreview';
import CornersMask from './CornersMask';
import styles from './styles';
import {capitalize} from 'lodash';

const Camera = ({navigation}: any) => {
  const device = useCameraDevice('back');
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();

  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const isFocused = useIsFocused();
  const navigationState = useNavigationState(state => state);

  const cameraRef = useRef<CameraComponent>(null);
  const flareRef = useRef<CameraFlareViewRef>(null);
  const photoHistoryRef = useRef<any>(null);

  const {appendPhotoToHistory} = usePhotoHistory();

  const takePhotoOptions: TakePhotoOptions = useMemo(
    () => ({
      photoCodec: 'jpeg',
      qualityPrioritization: 'speed',
      flash: isFlashOn ? 'on' : 'off',
      quality: 100,
      skipMetadata: true,
    }),
    [isFlashOn],
  );

  const addPickPath = useMemo(() => {
    const routes = navigationState.routes;
    const prevRoute = routes[routes.length - 2];

    if (prevRoute && prevRoute.key.includes(RouteNames.AddPickStack)) {
      return RouteNames.AddPick;
    }
    return RouteNames.AddPickStack;
  }, [navigationState]);

  useDelayedEffect(() => {
    Permissions.askForCameraPermission(isGranted => {
      console.log('Camera permission isGranted', isGranted);
    });
  }, 500);

  const showPreview = (photo: any) => {
    setIsPreviewVisible(true);
    setSelectedAsset(photo);
  };

  // Callback

  const onDismiss = () => {
    navigation.goBack();
  };

  const onSwitchFlashPress = () => {
    setIsFlashOn(!isFlashOn);
  };

  const onTakePhotoPress = async () => {
    if (!cameraRef.current) {
      return;
    }

    flareRef.current?.flare();

    const takenPhoto = await cameraRef.current.takePhoto(takePhotoOptions);

    const photoID = generateUUID();
    const photo = {id: photoID, uri: takenPhoto.path};

    setSelectedAsset(photo);
    setIsPreviewVisible(true);
    appendPhotoToHistory(photo);
  };

  const onGalleryPress = () => {
    openImagePicker((asset: any) => {
      const photoID = generateUUID();
      const photo = {id: photoID, uri: asset.uri};

      showPreview(photo);
      appendPhotoToHistory(photo);
    });
  };

  const onPhotoHistoryPress = (photo: any) => {
    showPreview(photo);
  };

  return (
    <>
      <MainContainer enableDismissGesture style={{paddingBottom: 0}}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <IconButton forceDarkTheme icon={CloseIcon} onPress={onDismiss} />

          <MainText size={18} color="#fff" weight="semiBold">
            {t('Common:scanText')}
          </MainText>

          <IconButton
            isTransparent
            forceDarkTheme
            isActive={isFlashOn}
            states={[
              {icon: FlashOnIcon, type: 'primary'},
              {icon: FlashOffIcon, type: 'secondary'},
            ]}
            onPress={onSwitchFlashPress}
          />
        </View>

        {device != undefined && (
          <View style={styles.cameraContainer}>
            <View>
              <CameraComponent
                photo
                ref={cameraRef}
                style={styles.camera}
                device={device}
                isActive={isFocused}
              />

              <CornersMask />
            </View>
          </View>
        )}

        <CameraFlareView ref={flareRef} />

        <View style={styles.photosHistory}>
          <PhotosHistory onPress={onPhotoHistoryPress} ref={photoHistoryRef} />
        </View>

        <View
          style={[
            styles.bottomContainer,
            {paddingBottom: insets.bottom, backgroundColor: '#060606'},
          ]}>
          <View style={styles.sideItem}>
            <IconButton
              side={50}
              isBlurred
              forceDarkTheme
              icon={GalleryIcon}
              onPress={onGalleryPress}
            />
          </View>

          <ScaleButton isHaptic onPress={onTakePhotoPress}>
            <View style={styles.cameraButtonOuter}>
              <View style={styles.cameraButtonInner} />
            </View>
          </ScaleButton>

          <View style={styles.sideItem}>
            <IconButton
              isHaptic
              side={50}
              isBlurred
              forceDarkTheme
              icon={HistoryIcon}
              onPress={() => {
                photoHistoryRef.current?.toggle();
              }}
            />
          </View>
        </View>
      </MainContainer>

      <PicturePreview
        selectedAsset={selectedAsset}
        isVisible={isPreviewVisible}
        onBackPress={() => {
          setIsPreviewVisible(false);
        }}
        onNextPress={() => {
          Clipboard.getString().then(text => {
            navigation.navigate(addPickPath, {
              initialText: capitalize(text.toLowerCase()),
              isFromCamera: true,
              bookData: {id: route.params?.bookId},
            });
          });
          setTimeout(() => {
            setIsPreviewVisible(false);
          }, 1000);
        }}
      />
    </>
  );
};

export default Camera;
