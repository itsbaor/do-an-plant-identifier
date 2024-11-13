import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import IconBack from '~/resources/icons/IconBack';
import {useAppTheme} from '~/resources/theme';

const HeaderWithBack = ({
  handleGoBack,
  waitingAds,
  title,
}: {
  handleGoBack: () => void;
  waitingAds: boolean;
  title: string;
}) => {
  const theme = useAppTheme();
  return (
    <View
      style={[
        styles.ph_20,
        {
          marginVertical: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      ]}>
      <TouchableOpacity
        onPress={handleGoBack}
        disabled={waitingAds}
        style={waitingAds && {opacity: 0.5}}>
        <IconBack />
      </TouchableOpacity>
      <Text style={[styles.header, {color: theme.colors.primary_dark}]}>
        {title}
      </Text>
      <View style={{width: 32}}></View>
    </View>
  );
};

export default HeaderWithBack;

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'center',
  },
  ph_20: {
    paddingHorizontal: 20,
  },
});
