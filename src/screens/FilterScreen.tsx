import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import HeaderWithBack from '~/components/HeaderWithBack';
import {stateAdsRemote} from '~/redux/slices/adsRemoteSlice';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import Config from 'react-native-config';
import NativeBannerSmall from '~/components/ads/NativeBannerSmall';
import {
  setStateCategory,
  setUpdateCategoryChecklist,
  stateCategory,
} from '~/redux/slices/categorySlice';
import {e_CategoryLabel} from '~/data/categoryData';
import CheckboxText from '~/components/base/checkbox/CheckboxText';
import {
  CYCLE,
  GROWTH,
  SUN,
  t_CategoryChecklist,
  WATERING,
} from '~/@types/category';
import DropdownWithValue from '~/components/search/DropdownWithValue';

enum DROPDOWN {
  NONE,
  SUN,
  PLANT,
  GROWTH,
  WATERING,
}

const FilterScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'FilterScreen'>>();
  const route = useRoute<RouteProp<RootParamList, 'FilterScreen'>>();
  const [choosenDropdownIndex, setChoosenDropdownIndex] = useState<number>(
    DROPDOWN.NONE,
  );
  const adsRemote = useAppSelector(stateAdsRemote);
  const g_Category = useAppSelector(stateCategory);
  const [checkboxCategory, setCheckboxCategory] = useState<
    t_CategoryChecklist[]
  >(g_Category.categoryChecklist);
  const [sun, setSun] = useState<SUN>(g_Category.sun);
  const [cycle, setCycle] = useState<CYCLE>(g_Category.cycle);
  const [growth, setGrowth] = useState<GROWTH>(g_Category.growth);
  const [watering, setWatering] = useState<WATERING>(g_Category.watering);
  const [waitingAds, setWaitingAds] = useState<boolean>(
    adsRemote.NATIVE_SEARCH.isOn,
  );
  const theme = useAppTheme();
  const ID_ADS = __DEV__ ? undefined : adsRemote.NATIVE_SEARCH.id;
  const trans = [
    t('Perennial'),
    t('Average'),
    t('Sun-Part Shade'),
    t('Annual'),
    t('Biennial'),
    t('High'),
    t('Moderate'),
    t('Low'),
    t('Frequent'),
    t('Minimal'),
    t('Full Shade'),
    t('Part Shade'),
    t('Full Sun'),
  ];

  const handleUpdateFilterChange = () => {
    dispatch(
      setStateCategory({
        categoryChecklist: checkboxCategory,
        sun: sun,
        cycle: cycle,
        growth: growth,
        watering: watering,
      }),
    );
    navigation.goBack();
  };

  const handleUpdateCategory = (field: e_CategoryLabel, value: boolean) => {
    setCheckboxCategory(
      checkboxCategory.map(item =>
        item.category === field ? {...item, isChecked: value} : item,
      ),
    );
  };

  const handleChooseSun = (value: string) => {
    setSun(value as SUN);
  };
  const handleChooseCycle = (value: string) => {
    setCycle(value as CYCLE);
  };
  const handleChooseGrowth = (value: string) => {
    setGrowth(value as GROWTH);
  };
  const handleChooseWatering = (value: string) => {
    setWatering(value as WATERING);
  };
  const handleCloseDropdown = () => {
    setChoosenDropdownIndex(DROPDOWN.NONE);
  };
  const handleChooseDropdown = (index: number) => {
    index === choosenDropdownIndex
      ? setChoosenDropdownIndex(DROPDOWN.NONE)
      : setChoosenDropdownIndex(index);
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      <HeaderWithBack
        title={t('Filter')}
        waitingAds={waitingAds}
        handleGoBack={() => navigation.goBack()}
      />
      <View style={{flex: 1, marginBottom: 20, paddingHorizontal: 20}}>
        <ScrollView>
          {/* Check box */}
          <View
            style={{
              marginTop: 30,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {checkboxCategory.map((item, index) => (
              <View key={index} style={[styles.checkboxItemContainer]}>
                <CheckboxText
                  isChecked={item.isChecked}
                  text={item.category}
                  onCheck={() => {
                    handleUpdateCategory(item.category, !item.isChecked);
                  }}
                />
              </View>
            ))}
          </View>

          {/* Dropdown selection */}
          <View
            style={{
              marginTop: 8,
              gap: 18,
            }}>
            <View>
              {/* Title dropdown */}
              <Text style={[styles.dropdownTitle]}>{t('Sun Exposure')}</Text>
              {/* Dropdown Component */}
              <DropdownWithValue
                title={sun}
                index={DROPDOWN.SUN}
                selectedIndex={choosenDropdownIndex}
                onPress={handleChooseDropdown}
                valueArray={[
                  SUN.NONE,
                  SUN.FULL_SHADE,
                  SUN.PART_SHADE,
                  SUN.SUN_PART_SHADE,
                  SUN.FULL_SUN,
                ]}
                onChangeValue={handleChooseSun}
                closeDropdown={handleCloseDropdown}
              />
            </View>

            <View>
              {/* Title dropdown */}
              <Text style={[styles.dropdownTitle]}>{t('Plant Cycle')}</Text>
              {/* Dropdown Component */}
              <DropdownWithValue
                title={cycle}
                index={DROPDOWN.PLANT}
                selectedIndex={choosenDropdownIndex}
                onPress={handleChooseDropdown}
                valueArray={[
                  CYCLE.NONE,
                  CYCLE.PERENNIAL,
                  CYCLE.ANNUAL,
                  CYCLE.BIENNIAL,
                ]}
                onChangeValue={handleChooseCycle}
                closeDropdown={handleCloseDropdown}
              />
            </View>

            <View>
              {/* Title dropdown */}
              <Text style={[styles.dropdownTitle]}>{t('Growth Rate')}</Text>
              {/* Dropdown Component */}
              <DropdownWithValue
                title={growth}
                index={DROPDOWN.GROWTH}
                selectedIndex={choosenDropdownIndex}
                onPress={handleChooseDropdown}
                valueArray={[
                  GROWTH.NONE,
                  GROWTH.HIGH,
                  GROWTH.MODERATE,
                  GROWTH.LOW,
                ]}
                onChangeValue={handleChooseGrowth}
                closeDropdown={handleCloseDropdown}
              />
            </View>

            <View>
              {/* Title dropdown */}
              <Text style={[styles.dropdownTitle]}>{t('Watering')}</Text>
              {/* Dropdown Component */}
              <DropdownWithValue
                title={watering}
                index={DROPDOWN.WATERING}
                selectedIndex={choosenDropdownIndex}
                onPress={handleChooseDropdown}
                valueArray={[
                  WATERING.NONE,
                  WATERING.FREQUENT,
                  WATERING.AVERAGE,
                  WATERING.MINIMAL,
                ]}
                onChangeValue={handleChooseWatering}
                closeDropdown={handleCloseDropdown}
              />
            </View>
          </View>

          {/* Confirm button */}
          <TouchableOpacity
            disabled={waitingAds}
            style={{
              borderRadius: 5,
              backgroundColor: theme.colors.primary,
              paddingVertical: 10,
              paddingHorizontal: 30,
              alignSelf: 'center',
              marginTop: 30,
              marginBottom: 20,
              opacity: waitingAds ? 0.5 : 1,
            }}
            onPress={handleUpdateFilterChange}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 18,
                lineHeight: 22,
                fontFamily: 'Inter-Regular',
              }}>
              {t('Apply Filter')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      {adsRemote.NATIVE_SEARCH.isOn && (
        <NativeBannerSmall adId={ID_ADS} setWaitAds={setWaitingAds} />
      )}
    </SafeAreaView>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewStyle: {
    paddingHorizontal: 18,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    fontSize: 20,
    lineHeight: 32,
    fontFamily: 'Inter-Regular',
    fontWeight: '700',
    alignSelf: 'center',
  },
  checkboxItemContainer: {
    width: '33%',
    marginBottom: 15,
  },
  dropdownTitle: {
    paddingBottom: 9,
    fontFamily: 'Inter-Regular',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 18,
    color: '#000000',
  },
});
