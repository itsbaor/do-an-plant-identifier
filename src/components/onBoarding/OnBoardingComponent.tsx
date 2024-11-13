import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import React from 'react';
import {View, Text, StyleSheet, Image, ImageSourcePropType} from 'react-native';

type OnBoardingData = {
  title: string;
  image: NodeRequire;
};

const OnBoardingComponent = ({title, image}: OnBoardingData) => {
  return (
    <View style={[{flex: 1}]}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          style={{
            height: SCREEN_WIDTH > 400 ? 550 : 480,
            aspectRatio: 430 / 570,
          }}
          source={image as unknown as ImageSourcePropType}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.textTitle, {marginHorizontal: 25}]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textTitle: {
    color: '#4B6D4E',
    fontWeight: '600',
    fontSize: SCREEN_WIDTH > 400 ? 27 : 22,
    textAlign: 'center',
  },
});
export default OnBoardingComponent;
