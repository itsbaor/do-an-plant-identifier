import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useAppTheme} from '~/resources/theme';
import {useTranslation} from 'react-i18next';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {t_PlantType} from '~/@types/plant';

const ChoosePlantModal = ({
  modal: {closeModal, params},
}: {
  modal: {
    closeModal: any;
    params: {
      openModalAddPlant: () => void;
      plantList: t_PlantType[];
      navigateCaculator: (plantName: string) => void;
    };
  };
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const [selectedPlant, setSelectedPlant] = useState<string>();

  return (
    <Pressable
      style={[styles.container, {justifyContent: 'flex-end'}]}
      onPress={closeModal}>
      <Pressable
        style={[
          {
            backgroundColor: theme.colors.bg_white,
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            paddingVertical: 30,
            paddingHorizontal: 30,
            gap: 15,
            alignItems: 'center',
            height: params.plantList.length
              ? SCREEN_HEIGHT * 0.7
              : SCREEN_HEIGHT * 0.23,
          },
        ]}>
        <Text
          style={{
            color: theme.colors.primary_dark,
            textAlign: 'center',
            fontSize: 20,
            fontWeight: '700',
          }}>
          {t('Water Caculator')}
        </Text>
        <Text
          style={[styles.textStyle, {color: theme.colors.text_gray_home}]}
          numberOfLines={3}>
          {params.plantList.length
            ? t('Choose your plant')
            : t(
                'You don’t have any plant. Please add your first plants and start caring for it',
              )}
        </Text>
        {params.plantList.length ? (
          <View style={{flex: 1, width: '100%'}}>
            <View style={{flex: 1}}>
              <ScrollView style={{}}>
                {params.plantList.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    disabled={selectedPlant === item.name}
                    style={[
                      {
                        width: '100%',
                        marginBottom: 10,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        padding: 8,
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: theme.colors.border_gray,
                        gap: 8,
                      },
                      selectedPlant === item.name && {
                        borderColor: theme.colors.primary,
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                    onPress={() => setSelectedPlant(item.name)}>
                    <Image
                      resizeMode="cover"
                      style={{width: 60, aspectRatio: 1, borderRadius: 5}}
                      source={
                        (typeof item.image == 'string'
                          ? {uri: item.image}
                          : item.image) as unknown as ImageSourcePropType
                      }
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        color:
                          selectedPlant === item.name
                            ? theme.colors.text_white
                            : theme.colors.text_black,
                      }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <TouchableOpacity
              disabled={selectedPlant == '' || selectedPlant == undefined}
              style={[
                styles.btnStyle,
                {backgroundColor: theme.colors.primary, marginTop: 10},
                (selectedPlant == '' || selectedPlant == undefined) && {
                  opacity: 0.5,
                },
              ]}
              onPress={() => params.navigateCaculator(selectedPlant as string)}>
              <Text
                style={[
                  {
                    color: theme.colors.text_white,
                    fontSize: 16,
                    textAlign: 'center',
                  },
                ]}>
                {t('Caculator')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.btnStyle, {backgroundColor: theme.colors.primary}]}
            onPress={params.openModalAddPlant}>
            <Text style={[{color: theme.colors.text_white, fontSize: 16}]}>
              {t('Add Plant')}
            </Text>
          </TouchableOpacity>
        )}
      </Pressable>
    </Pressable>
  );
};

export default ChoosePlantModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  btnStyle: {
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 30,
  },
  textStyle: {fontSize: 14, fontWeight: '600', textAlign: 'center'},
});
