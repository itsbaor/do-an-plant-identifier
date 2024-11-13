import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useAppTheme} from '~/resources/theme';
import {useTranslation} from 'react-i18next';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import IconCamera from '~/resources/icons/IconCamera';
import IconDoubleLeaf from '~/resources/icons/IconDoubleLeaf';

const AddPlantModal = ({
  modal: {params, closeModal},
}: {
  modal: {
    params: {openIdentCam: () => void; openSearch: () => void};
    closeModal: any;
  };
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();

  return (
    <Pressable
      style={[styles.container, {justifyContent: 'flex-end'}]}
      onPress={closeModal}>
      <Pressable
        style={{
          backgroundColor: theme.colors.bg_white,
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
          paddingVertical: 30,
          gap: 15,
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: theme.colors.primary_dark,
            textAlign: 'center',
            fontSize: 20,
            fontWeight: '700',
          }}>
          {t('Add Plant')}
        </Text>
        <TouchableOpacity
          style={[styles.btnStyle]}
          onPress={params.openIdentCam}>
          <IconCamera />
          <Text
            style={[styles.textStyle, {color: theme.colors.text_gray_home}]}>
            {t('Identify by photo')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnStyle]} onPress={params.openSearch}>
          <IconDoubleLeaf />
          <Text
            style={[styles.textStyle, {color: theme.colors.text_gray_home}]}>
            {t('Search by name')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnStyle]} onPress={closeModal}>
          <Text
            style={[styles.textStyle, {color: theme.colors.text_gray_home}]}>
            {t('Cancel')}
          </Text>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  );
};

export default AddPlantModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  btnStyle: {
    borderRadius: 10,
    borderWidth: 1,
    width: SCREEN_WIDTH / 1.6,
    paddingVertical: 5,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {fontSize: 16, fontWeight: '600'},
});
