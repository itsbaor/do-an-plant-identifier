import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import IconFunctionClose from '~/resources/icons/IconFunctionClose';
import IconFunctionShow from '~/resources/icons/IconFunctionShow';
import {useAppTheme} from '~/resources/theme';
type DropdownParams = {
  title: string;
  onChangeValue: (value: string) => void;
  closeDropdown: () => void;
  value?: string;
  isDisableDropdown?: boolean;
  index?: number;
  selectedIndex: number;
  onPress: (index: number) => void; //Show dropdown
  valueArray: string[];
};

const DropdownWithValue = ({
  title = 'Plant',
  onChangeValue,
  value = '',
  isDisableDropdown = false,
  index = -1,
  selectedIndex = 0,
  onPress,
  valueArray,
  closeDropdown,
}: DropdownParams) => {
  const {t} = useTranslation();
  const theme = useAppTheme();

  return (
    <>
      <TouchableOpacity
        style={[styles.container, {borderColor: theme.colors.primary}]}
        onPress={() => {
          onPress(index);
        }}
        disabled={isDisableDropdown}>
        <Text style={[styles.title, {color: theme.colors.text_black}]}>
          {t(title)}
        </Text>
        <View style={[styles.valueContainer, {}]}>
          <Text style={[styles.value]}> {t(value)}</Text>
          {index === selectedIndex ? (
            <IconFunctionShow />
          ) : (
            <IconFunctionClose />
          )}
        </View>
      </TouchableOpacity>
      {index === selectedIndex && (
        <View
          style={{
            width: '100%',
            minHeight: 50,
            marginTop: 10,
            borderWidth: 1,
            borderColor: 'rgba(75, 109, 78, 0.2)',
            borderRadius: 5,
            backgroundColor: '#FFFFFF',
            padding: 5,
          }}>
          {valueArray.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={[
                {
                  width: '100%',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 5,
                },
                title === value && {backgroundColor: 'rgba(227, 239, 222, 1)'},
              ]}
              onPress={() => {
                onChangeValue(value);
                closeDropdown();
              }}>
              <Text
                style={[
                  {
                    fontSize: 12,
                    lineHeight: 16,
                    fontWeight: '400',
                    color: 'rgba(119, 124, 126, 1)',
                  },
                  title === value && {fontWeight: '700'},
                ]}>
                {t(value)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 38,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 11,
    borderWidth: 1,
    borderRadius: 5,
    // shadowColor: "rgba(0,0,0,0.7)",
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
    // elevation: 15,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '600',
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 4,
    alignItems: 'center',
  },
  value: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: 'rgba(119, 124, 126, 1)',
  },
});

export default DropdownWithValue;
