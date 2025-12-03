import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~/hooks/useReduxStore';
import {useAppTheme} from '~/resources/theme';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import {statePremium} from '~/redux/slices/premiumSlice';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {
  fetchExploreData,
  t_ExplorePost,
} from './bottom-tabs/garden/top-tabs/Explore';
import IconBack from '~/resources/icons/IconBack';
import {useModal} from 'react-native-modalfy';
import LottieView from 'lottie-react-native';

const ExploreDetailScreen = () => {
  const {t} = useTranslation();
  const {openModal, closeModals} = useModal();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'ExploreDetailScreen'>>();
  const route = useRoute<RouteProp<RootParamList, 'ExploreDetailScreen'>>();
  const theme = useAppTheme();
  const isPre = useAppSelector(statePremium);
  const [postDetail, setPostDetail] = useState<t_ExplorePost>(route.params);
  const [listPost, setListPost] = useState<t_ExplorePost[]>([]);
  const [listPostShow, setListPostShow] = useState<t_ExplorePost[]>([]);
  const [loading, setLoading] = useState(true);
  const pageRandom = useMemo(() => {
    const min = 1;
    const max = 10;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, []);

  const handleShowNewDetail = (item: t_ExplorePost) => {
    setPostDetail({...item});
    if (listPost.length > 7) {
      const startIndex = Math.floor(Math.random() * (listPost.length - 6));
      setListPostShow(listPost.slice(startIndex, startIndex + 7));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const exploreDataPage = await fetchExploreData(pageRandom);
      setLoading(false);
      setListPost(exploreDataPage);
      setListPostShow(
        exploreDataPage.length > 7
          ? exploreDataPage.slice(0, 7)
          : exploreDataPage,
      );
    };
    loadData();
  }, []);


  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      <View
        style={[
          styles.ph_20,
          {
            marginBottom: 25,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconBack />
        </TouchableOpacity>
        <Text style={[styles.header, {color: theme.colors.primary_dark}]}>
          {t('Explore')}
        </Text>
        <View style={{width: 32}}></View>
      </View>
      <ScrollView style={[styles.ph_20, {flex: 1}]}>
        <View style={[{width: '100%', marginBottom: 15}]}>
          <Image
            source={{uri: postDetail.image}}
            resizeMode="cover"
            style={{
              width: SCREEN_WIDTH - 40,
              aspectRatio: 350 / 195,
              borderRadius: 10,
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text_black,
            marginBottom: 15,
            textAlign: 'left',
            lineHeight: 25,
          }}>
          {postDetail.title}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '400',
            color: theme.colors.text_black,
            marginBottom: 20,
            textAlign: 'left',
            lineHeight: 15,
          }}>
          {postDetail.content}
        </Text>
        <Text
          style={[
            {
              marginVertical: 15,
              color: theme.colors.primary_dark,
              fontSize: 20,
              lineHeight: 32,
              fontWeight: '700',
              marginBottom: 10,
            },
          ]}>
          {t('Similar')}
        </Text>
        {loading ? (
          <View style={{height: '100%', width: SCREEN_WIDTH}}>
            <LottieView
              source={require('~/resources/animations/circular_loading.json')}
              autoPlay
              loop
              style={{width: '100%', height: '25%'}}
            />
          </View>
        ) : (
          <ScrollView horizontal>
            {listPostShow.map((item, index) => (
              <View key={index} style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  key={index}
                  style={{
                    width: SCREEN_WIDTH / 2.5,
                    borderWidth: 1,
                    borderColor: theme.colors.primary_dark,
                    borderRadius: 11,
                    marginRight: 10,
                  }}
                  onPress={() => handleShowNewDetail(item)}>
                  <Image
                    resizeMode="cover"
                    source={
                      item.image === 'img_default_image'
                        ? require('~/resources/images/garden/backgroundexplore.png')
                        : {uri: item.image}
                    }
                    style={[
                      {
                        width: SCREEN_WIDTH / 2.5,
                        aspectRatio: 160 / 135,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      },
                    ]}
                  />
                  <View style={{paddingLeft: 10}}>
                    <Text style={styles.title}>{item.title}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '700',
    alignSelf: 'center',
  },
  ph_20: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: 'black',
  },
});
