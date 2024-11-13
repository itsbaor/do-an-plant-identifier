import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardTypeOptions,
} from 'react-native';
import {useAppTheme} from '~/resources/theme';

type TextInputParams = {
  placeHolder: string;
  unit?: string;
  keyBoardType?: KeyboardTypeOptions;
  maxLength?: number;
  onChangeText?: React.Dispatch<React.SetStateAction<string>>;
  value?: string;
  isInvalid?: boolean;
};

const TextInputComponent = ({
  placeHolder,
  unit,
  keyBoardType,
  maxLength,
  onChangeText,
  value,
  isInvalid,
}: TextInputParams) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  return (
    <>
      <View
        style={[
          styles.container,
          {
            borderColor: isInvalid
              ? theme.colors.text_error
              : theme.colors.primary,
          },
        ]}>
        <TextInput
          style={[styles.textInput, {}]}
          placeholder={`${t(placeHolder)}`}
          placeholderTextColor="rgba(0, 0, 0, 0.55)"
          keyboardType={keyBoardType ?? 'default'}
          maxLength={maxLength}
          onChangeText={onChangeText}
          value={value}
        />
        {unit && <Text style={[styles.unitText, {}]}>{unit}</Text>}
      </View>
      {isInvalid && (
        <Text
          style={{
            color: theme.colors.text_error,
            fontSize: 10,
            textAlign: 'left',
          }}>
          {t('This field is required!')}
        </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    height: 38,
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  textInput: {
    fontFamily: 'Inter-Regular',
    color: '#000000',
    width: '100%',
    paddingLeft: 15,
  },
  unitText: {
    position: 'absolute',
    fontFamily: 'Inter-Regular',
    color: '#000000',
    right: 20,
  },
});

export default TextInputComponent;
