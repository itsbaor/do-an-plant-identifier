import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import IconFunctionClose from '~/resources/icons/IconFunctionClose';
import IconFunctionShow from '~/resources/icons/IconFunctionShow';
import {useAppTheme} from '~/resources/theme';

type DropdownParams = {
  title: string;
  onChangeValue?: () => void;
  value?: string;
  isDisableDropdown?: boolean;
  index?: number;
  selectedIndex?: number;
  onPress: (index: number) => void; //Show dropdown
};

//This component is usually used by Screen of WaterCaculation and Reminder
const FlexDropdown = ({
  title = 'Plant',
  value = '',
  isDisableDropdown = false,
  index = -1,
  selectedIndex = 0,
  onPress,
}: DropdownParams) => {
  const {t} = useTranslation();
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      style={[styles.container, {borderColor: theme.colors.primary}]}
      onPress={() => {
        onPress(index);
      }}
      disabled={isDisableDropdown}>
      <Text style={[styles.title, {color: theme.colors.primary_dark}]}>
        {t(title)}
      </Text>
      <View style={[styles.valueContainer, {}]}>
        <Text style={[styles.value]}> {value}</Text>
        {index === selectedIndex ? <IconFunctionShow /> : <IconFunctionClose />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.7)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 15,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
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

export default FlexDropdown;
