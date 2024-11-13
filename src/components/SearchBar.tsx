import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useAppTheme} from '~/resources/theme';
import IconSearch from '~/resources/icons/IconSearch';

type SearchInputParams = {
  placeholder: string;
  stateText: string | undefined;
  setStateText: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleSearch: () => void;
};

const SearchBar = ({
  placeholder,
  stateText,
  setStateText,
  handleSearch,
}: SearchInputParams) => {
  const theme = useAppTheme();
  return (
    <View
      style={[
        styles.container,
        {borderColor: theme.colors.border_green_opacity},
      ]}>
      <TouchableOpacity
        style={{}}
        onPress={() => {
          handleSearch();
          Keyboard.dismiss();
        }}>
        <IconSearch />
      </TouchableOpacity>
      <View style={{flex: 1}}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={'#5F6466'}
          style={{color: theme.colors.text_black}}
          onChangeText={setStateText}
          value={stateText}
          onBlur={handleSearch}
        />
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});
