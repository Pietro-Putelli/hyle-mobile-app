import {useEffect, useRef, useState} from 'react';

const useSearchFashion = ({onChange, initialValue}: any) => {
  const typingTimeout = useRef<any>(0);

  const [searchText, setSearchText] = useState(initialValue ?? '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      setIsLoading(false);

      onChange({value: searchText});
    }, 250);
  }, [searchText]);

  return {
    searchText,
    onChangeText: setSearchText,
    isLoading,
    setIsLoading,
  };
};

export default useSearchFashion;
