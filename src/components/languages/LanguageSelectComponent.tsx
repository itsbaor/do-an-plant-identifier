import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import RadioButton from '../base/RadioButton';
import {useAppTheme} from '~/resources/theme';
import {t_Lang, t_LangObject} from '~/@types/language';

type SelectLanguage = {
  languageObject: t_LangObject;
  languageSelected: t_Lang;
  onSelectLanguage: (id: t_Lang) => void;
};

const LanguageSelectComponent = ({
  languageObject,
  languageSelected,
  onSelectLanguage,
}: SelectLanguage) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const {id, name, image} = languageObject;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        languageSelected === id
          ? {
              borderColor: theme.colors.primary_dark,
              backgroundColor: theme.colors.primary,
            }
          : {
              borderColor: theme.colors.border_gray,
              backgroundColor: theme.colors.bg_white,
            },
      ]}
      onPress={() => {
        onSelectLanguage(id);
      }}>
      <View style={[styles.iconText]}>
        <View>{image}</View>
        <Text
          style={[
            styles.text,
            languageSelected === id
              ? {color: theme.colors.text_white}
              : {color: theme.colors.text_black},
          ]}>
          {t(name)}
        </Text>
      </View>
      <View style={[styles.radioButton]}>
        <RadioButton
          value={languageSelected}
          state={languageSelected === id ? true : false}
          color={
            languageSelected === id
              ? theme.colors.bg_white
              : theme.colors.border_gray
          }
          onPress={() => {
            onSelectLanguage(id);
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 57,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingLeft: 12,
  },
  iconText: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {},
  text: {
    fontSize: 16,
  },
});

export default LanguageSelectComponent;
