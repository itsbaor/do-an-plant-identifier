import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {t_PlantType} from '~/@types/plant';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useAppTheme} from '~/resources/theme';
import IconFamily from '~/resources/icons/plantDetail/IconFamily';
import IconWaterDetail from '~/resources/icons/plantDetail/IconWaterDetail';
import IconSunlightDetail from '~/resources/icons/plantDetail/IconSunlightDetail';
import IconAddPlant from '~/resources/icons/garden/IconAddPlant';
import IconRemove from '~/resources/icons/garden/IconRemove';

const PlantItem = ({
  plant,
  handleOpenDetails,
  handleAddPlantToGarden,
  handleRemovePlantFromGarden,
  isDisable = false,
}: {
  plant: t_PlantType;
  handleOpenDetails: () => void;
  handleAddPlantToGarden?: () => void;
  handleRemovePlantFromGarden?: () => void;
  isDisable?: boolean;
}) => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  return (
    <TouchableOpacity
      key={plant.id}
      disabled={isDisable}
      style={[styles.plantItem, isDisable && {opacity: 0.5}]}
      onPress={handleOpenDetails}>
      <View style={{width: '100%'}}>
        {/* Title */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#32A05F',
            paddingVertical: 5,
          }}>
          <View style={{width: '100%', paddingLeft: 8}}>
            <Text style={styles.plantName1} numberOfLines={2}>
              {plant.name}
            </Text>
          </View>
        </View>
        {/* Content */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingHorizontal: 10,
            gap: 8,
            paddingVertical: 8,
          }}>
          {/* Left content */}
          <View style={{width: '45%', justifyContent: 'flex-end'}}>
            <Image
              style={{aspectRatio: 1, borderRadius: 10, width: '100%'}}
              source={
                (typeof plant.image === 'string'
                  ? {uri: plant.image}
                  : plant.image) as ImageSourcePropType
              }
              resizeMode="cover"
            />
          </View>
          {/* Right content */}
          <View style={{width: '55%', flex: 1}}>
            <View
              style={{
                paddingRight: 8,
                flex: 0.8,
                justifyContent: 'flex-start',
              }}>
              <Text style={styles.plantName2} numberOfLines={2}>
                {t(`Also called `) + plant.treeLike}
              </Text>
              <View style={styles.plantDetailContainer}>
                <View style={styles.textcontainer}>
                  <IconFamily height={12} width={12} />
                  <Text style={styles.plantDetail} numberOfLines={1}>
                    {t('Cycle: ') + t(plant.type)}
                  </Text>
                </View>
                <View style={styles.textcontainer}>
                  <IconWaterDetail height={10} width={10} />
                  <Text style={styles.plantDetail} numberOfLines={1}>
                    {t('Water: ') + t(plant.waterlevel)}
                  </Text>
                </View>
                <View style={styles.textcontainer}>
                  <IconSunlightDetail height={10} width={10} />
                  <Text style={styles.plantDetail} numberOfLines={1}>
                    {t('Light: ') + t(plant.sunlevel)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{flex: 0.2, justifyContent: 'flex-end'}}>
              {handleAddPlantToGarden && (
                <>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                    onPress={handleAddPlantToGarden}>
                    <IconAddPlant />
                    <Text style={styles.buttonText}>{t('My Garden')}</Text>
                  </TouchableOpacity>
                </>
              )}
              {handleRemovePlantFromGarden && (
                <>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        backgroundColor: theme.colors.bg_white,
                        borderWidth: 1,
                        borderColor: theme.colors.text_error,
                      },
                    ]}
                    onPress={handleRemovePlantFromGarden}>
                    <IconRemove
                      height={16}
                      width={16}
                      colors={theme.colors.text_error}
                    />
                    <Text
                      style={[
                        styles.buttonText,
                        {color: theme.colors.text_error},
                      ]}>
                      {t('Remove')}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PlantItem;

const styles = StyleSheet.create({
  textcontainer: {
    flexDirection: 'row',
  },
  itemFooter: {
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  button: {
    // flex: 1,
    borderRadius: 5,
    paddingVertical: SCREEN_WIDTH > 400 ? 8 : 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonText: {
    fontFamily: 'Inter-Regular',
    fontSize: SCREEN_WIDTH > 400 ? 15 : 14,
    lineHeight: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  plantItem: {
    flexDirection: 'row',
    // width: SCREEN_WIDTH - 44,
    borderColor: '#32A05F',
    borderWidth: 1,
    borderRadius: 5,
    position: 'relative',
    marginBottom: 15,
  },
  plantDetailContainer: {
    gap: SCREEN_WIDTH > 400 ? 7 : 5,
    paddingLeft: 3,
  },
  plantDetail: {
    fontSize: SCREEN_WIDTH > 400 ? 12 : 11,
    fontWeight: '400',
    lineHeight: 12,
    color: '#000000',
    marginLeft: SCREEN_WIDTH > 400 ? 5 : 3,
  },
  plantName1: {
    color: '#FFFFFF',
    fontSize: SCREEN_WIDTH > 400 ? 17 : 16,
    fontWeight: '600',
    textAlign: 'left',
    fontFamily: 'Inter-Regular',
  },
  plantName2: {
    marginBottom: 8,
    fontSize: SCREEN_WIDTH > 400 ? 14 : 13,
    fontWeight: '600',
    lineHeight: 14,
    color: '#000000',
  },
});
