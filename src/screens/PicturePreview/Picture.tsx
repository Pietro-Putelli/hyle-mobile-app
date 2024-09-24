import {FadeAnimatedView} from '@/components/Animations';
import {fileSystemStorage} from '@/storage/store';
import {Image} from 'expo-image';
import React, {useEffect} from 'react';
import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const Picture = ({pictureId}: any) => {
  const [data, setData] = React.useState<any>(null);

  useEffect(() => {
    (async () => {
      const photo = await fileSystemStorage.getItem(pictureId);
      setData(photo);
    })();
  }, [pictureId]);

  return (
    <FadeAnimatedView mode="fade">
      <Image
        enableLiveTextInteraction
        source={{uri: `data:image/jpg;base64,${data}`}}
        style={{height: (4 / 2.9) * width, width: width}}
      />
    </FadeAnimatedView>
  );
};

export default Picture;
