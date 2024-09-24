import {Skeleton} from 'moti/skeleton';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import MainText from '../MainText';
import styles from './styles';
import {BookTopicsProps} from './types';

const BookTopics = ({data, size = 12}: BookTopicsProps) => {
  return (
    <View>
      <Skeleton radius={'square'}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
          }}>
          {data.map((keyword: any) => {
            return (
              <TouchableOpacity
                disabled
                activeOpacity={0.7}
                style={[styles.cell, {backgroundColor: keyword.color}]}
                key={keyword.topic}>
                <MainText
                  letterSpacing={1.2}
                  weight="semiBold"
                  uppercase
                  color="#fff"
                  size={size}
                  style={{
                    fontWeight: '500',
                  }}>
                  {keyword.topic}
                </MainText>
              </TouchableOpacity>
            );
          })}
        </View>
      </Skeleton>
    </View>
  );
};

export default BookTopics;
