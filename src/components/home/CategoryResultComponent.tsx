import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {useAppTheme} from '~/resources/theme';
import {useTranslation} from 'react-i18next';

type CategoryItem = {
  label: string[] | undefined;
  name: string;
  image: string | NodeRequire;
  onPress: () => void;
};

const CategoryResultComponent = ({
  label,
  name = 'Tropical Plant',
  image,
  onPress,
}: CategoryItem) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  return (
    <TouchableOpacity
      style={[styles.container, {borderColor: theme.colors.primary}]}
      onPress={onPress}>
      <View style={{flex: 0.8}}>
        <Image
          style={[styles.styleImage]}
          source={{uri: image} as ImageSourcePropType}
        />
      </View>
      <View
        style={[styles.textContainer, {backgroundColor: theme.colors.primary}]}>
        <View style={{flexDirection: 'row'}}>
          {label?.map((item, index) => (
            <Text key={index} style={[styles.textLabel]}>
              {t(item) + (index === label.length - 1 ? '' : ', ')}
            </Text>
          ))}
        </View>
        <Text style={[styles.textName]}>{name}</Text>
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
    width: 170,
    height: 200,
    marginRight: 12,
  },
  textContainer: {
    flex: 0.2,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-between',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  styleImage: {
    // width: 208,
    // height: 182,
    flex: 1,
    aspectRatio: 210 / 182,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  textLabel: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 12,
    color: '#FFFFFF',
  },
  textName: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 15,
    color: '#FFFFFF',
  },
});

export default CategoryResultComponent;
