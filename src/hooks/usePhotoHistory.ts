import {
  appendStatePhotoToHistory,
  getPhotosHistory,
  removeStatePhotoFromHistory,
} from '@/storage/slices/utilitySlice';
import {fileSystemStorage} from '@/storage/store';
import * as FileSystem from 'expo-file-system';
import {cloneDeep} from 'lodash';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

const usePhotoHistory = () => {
  const dispatch = useDispatch();

  const photos = useSelector(getPhotosHistory);
  const reversedPhotos = cloneDeep(photos).reverse();

  const appendPhotoToHistory = async (photo: any) => {
    const {uri} = photo;

    let base64 = photo?.base64;

    if (base64 == undefined) {
      try {
        base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } catch (error) {
        return;
      }
    }

    const photoID = photo.id;

    await fileSystemStorage.setItem(photoID, base64);

    dispatch(appendStatePhotoToHistory({id: photoID}));
  };

  const removePhotoFromHistory = async (photo: any) => {
    dispatch(removeStatePhotoFromHistory(photo));

    await fileSystemStorage.removeItem(photo.id);
  };

  return {
    photos,
    reversedPhotos,
    appendPhotoToHistory,
    removePhotoFromHistory,
  };
};

export default usePhotoHistory;
