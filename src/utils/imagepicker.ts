import * as ImagePicker from 'expo-image-picker';

export const openImagePicker = async (callback: (asset: any) => void) => {
  ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    selectionLimit: 1,
    quality: 1,
    base64: true,
  })
    .then((response: ImagePicker.ImagePickerResult) => {
      const asset = response.assets?.[0];

      if (asset) {
        callback({
          uri: asset.uri,
          id: asset.assetId,
          base64: asset.base64,
        });
      }
    })
    .catch((error: any) => {
      console.log('[openImagePicker] Error: ', error);
    });
};
