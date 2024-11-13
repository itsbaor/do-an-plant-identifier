import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useAppTheme} from '~/resources/theme';
import {useTranslation} from 'react-i18next';

export type t_WaterNeedParams = {
  amount: string | number;
  plantName: string;
  actionTryAgain: () => void;
  actionDone: () => void;
};

const InformWaterNeedModal = ({
  modal: {params, closeModal},
}: {
  modal: {params: t_WaterNeedParams; closeModal: any};
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
        {t('Watering')}
      </Text>
      <Text
        style={{
          color: theme.colors.text_black,
          fontSize: 15,
          fontWeight: '400',
          textAlign: 'center',
          marginBottom: 25,
        }}>
        {`You need to give ${params.plantName} `}
        <Text
          style={{
            color: theme.colors.text_black,
            fontSize: 15,
            fontWeight: '700',
            textAlign: 'center',
          }}>
          {`${params.amount}ml `}
        </Text>
        {`of water `}
        <Text
          style={{
            color: theme.colors.text_black,
            fontSize: 15,
            fontWeight: '700',
            textAlign: 'center',
          }}>
          {`every 7 days.`}
        </Text>
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
          onPress={params.actionTryAgain}>
          <Text
            style={{
              color: theme.colors.primary_dark,
              fontSize: 18,
              fontWeight: '600',
            }}>
            {t('Try again')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 25,
            borderRadius: 5,
            paddingVertical: 7,
          }}
          onPress={params.actionDone}>
          <Text
            style={{
              color: theme.colors.text_white,
              fontSize: 18,
              fontWeight: '600',
            }}>
            {t('Done')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InformWaterNeedModal;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
  },
});
