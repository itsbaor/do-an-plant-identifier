import React from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useAppTheme} from '~/resources/theme';

const HorizontalSliderComponent = ({
  name = 'Indoor Plant',
  otherName = 'Tropical Plant',
  image = null,
  itemWidth = 163,
  onPress,
}: {
  name?: string;
  otherName?: string;
  image: any;
  itemWidth?: number;
  onPress: () => void;
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  return (
    <TouchableOpacity
      style={[styles.container, {borderColor: theme.colors.primary}]}
      onPress={onPress}>
      <View
        style={[styles.imageContainer, {borderColor: theme.colors.primary}]}>
        <Image
          style={[styles.styleImage, {width: itemWidth}]}
          source={typeof image === 'string' ? {uri: image} : image}
          resizeMode="cover"
        />
      </View>
      <View
        style={[
          styles.textContainer,
          {backgroundColor: theme.colors.bg_white, width: itemWidth},
        ]}>
        <Text style={[styles.textName]}>{t(name)}</Text>
        <Text style={[styles.textOtherName]}>{t(otherName)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 12,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  textContainer: {
    height: 65,
    paddingTop: 7,
    paddingBottom: 14,
    paddingHorizontal: 9,
    justifyContent: 'space-between',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  styleImage: {
    height: 135,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  textName: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 24,
    color: '#000000',
  },
  textOtherName: {
    fontSize: 9,
    fontWeight: '400',
    lineHeight: 15,
    color: '#000000',
  },
});

export default HorizontalSliderComponent;
