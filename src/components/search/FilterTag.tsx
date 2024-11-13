import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import IconClose from '~/resources/icons/IconClose';
import {useAppTheme} from '~/resources/theme';

type FilterTagParam = {
  label: string;
  onRemove: () => void;
};

const FilterTag = ({label, onRemove}: FilterTagParam) => {
  const theme = useAppTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.primary,
        borderRadius: 30,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 5,
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 30,
          color: 'rgba(255, 255, 255, 1)',
          fontWeight: '600',
        }}>
        {label}
      </Text>
      <TouchableOpacity onPress={onRemove}>
        <IconClose width={18} height={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default FilterTag;
