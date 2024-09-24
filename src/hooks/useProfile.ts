import {getIsUserLogged, getProfileState} from '@/storage/slices/profileSlice';
import {useSelector} from 'react-redux';

const useProfile = () => {
  const profile = useSelector(getProfileState);
  const isLogged = useSelector(getIsUserLogged);

  return {
    profile,
    settings: profile.settings,
    isLogged,
  };
};

export default useProfile;
