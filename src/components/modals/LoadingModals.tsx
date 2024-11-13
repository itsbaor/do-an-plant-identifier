import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useAppTheme} from '~/resources/theme';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';

export type LoadingParams = {
  message: string;
}

const LoadingModal = ({ modal: { params } }: { modal: { params: LoadingParams } }) => {
  const theme = useAppTheme();
  return (
    <View style={[styles.container, {backgroundColor: theme.colors.bg_white}]}>
      <LottieView
        source={require('~/resources/animations/circular_loading.json')}
        autoPlay
        loop
        style={{width: '100%', height: '25%'}}
      />
      <Text
        style={{
          color: theme.colors.primary,
          fontSize: 20,
          fontWeight: '600',
          textAlign: 'center',
        }}>
        {params.message}
      </Text>
    </View>
  );
};

export default LoadingModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
