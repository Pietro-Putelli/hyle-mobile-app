import React from 'react';
import styles from './styles';
import {View} from 'react-native';
import MainText from '../MainText';
import {MainButton} from '../Buttons';
import {useNavigation} from '@react-navigation/native';
import RouteNames from '@/constants/routeNames';

const Paywall = () => {
  const navigation = useNavigation<any>();

  const onPress = () => {
    navigation.navigate(RouteNames.Paywall);
  };

  return (
    <View style={styles.container}>
      <MainText color="#fff" size={24}>
        Unlock Your Full Potential
      </MainText>

      <MainText color="#fff" style={{marginTop: 16}}>
        Switch to Premium and transform your note-taking experience! Enjoy
        unlimited access to advanced features.
      </MainText>

      <View style={{marginTop: 24}}>
        <MainButton
          backgroundColor={'#15A29C'}
          onPress={onPress}
          title="upgrade now"
        />
      </View>
    </View>
  );
};

export default Paywall;
