import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAppTheme} from '~/resources/theme';

type CareToolComponentParam = {
  title: string;
  onPress: () => void;
  image: any;
};

const CareToolComponent = ({
  title = 'Water caculator',
  onPress,
  image = null,
}: CareToolComponentParam) => {
  const theme = useAppTheme();
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderColor: theme.colors.border_green_opacity,
          backgroundColor: theme.colors.bg_white,
        },
      ]}
      onPress={onPress}>
      <View style={[{width: '100%', flex: 0.8, justifyContent: 'center'}]}>
        <LottieView
          style={[{width: '100%', height: '100%'}]}
          source={image}
          autoPlay
          loop
        />
      </View>
      <View style={{width: '100%', flex: 0.2, justifyContent: 'center'}}>
        <Text style={[styles.text, {textAlign: 'center'}]} numberOfLines={1}>
          {title}
        </Text>
      </View>
      {/* <TouchableOpacity style={[styles.button, {backgroundColor: 'blue'}]} onPress={onPress}>
      </TouchableOpacity> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: (SCREEN_WIDTH - 3 * 20) / 3,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    aspectRatio: 1,
  },
  button: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Platform.OS == 'ios' ? 0 : 10,
  },
  text: {
    color: 'rgba(0, 0, 0, 0.45)',
    fontSize: SCREEN_WIDTH > 400 ? 14 : 11,
    lineHeight: 16,
    fontWeight: '600',
  },
});

export default CareToolComponent;
