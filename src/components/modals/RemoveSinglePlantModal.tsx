import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useAppTheme} from '~/resources/theme';
import {useTranslation} from 'react-i18next';

export type t_RemoveSinglePlantParams = {
  plantName: string;
  actionDelete: () => void;
};

const RemoveSinglePlantModal = ({
  modal: {params, closeModal},
}: {
  modal: {params: t_RemoveSinglePlantParams; closeModal: any};
}) => {
  const theme = useAppTheme();
  const {t} = useTranslation();

  return (
    <View
      style={[styles.container, {paddingHorizontal: 20, paddingVertical: 25}]}>
      <Text
        style={{
          color: theme.colors.primary_dark,
          fontSize: 22,
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: 10,
        }}>
        {t('Delete plant')}
      </Text>
      <Text
        style={{
          color: theme.colors.text_black,
          fontSize: 15,
          fontWeight: '500',
          textAlign: 'center',
          marginBottom: 25,
        }}>
        {`Do you want to delete ${params.plantName} from garden?`}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          gap: 12,
        }}>
        <TouchableOpacity
          style={{
            paddingHorizontal: 25,
            borderRadius: 5,
            paddingVertical: 7,
            borderColor: theme.colors.primary_dark,
            borderWidth: 1,
          }}
          onPress={closeModal}>
          <Text
            style={{
              color: theme.colors.primary_dark,
              fontSize: 18,
              fontWeight: '600',
            }}>
            {t('Cancle')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 25,
            borderRadius: 5,
            paddingVertical: 7,
          }}
          onPress={params.actionDelete}>
          <Text
            style={{
              color: theme.colors.text_white,
              fontSize: 18,
              fontWeight: '600',
            }}>
            {t('Confirm')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RemoveSinglePlantModal;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
  },
});
