import {
  Image,
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
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootParamList} from '~/navigations/RootNavigation';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import i18n from '~/i18n';
import LottieView from 'lottie-react-native';

export type t_ExplorePost = {
  id: string;
  content: string;
  title: string;
  image: string;
};

const URL_EXPLORE =
  'https://perenual.com/api/article-faq-list?key=sk-w4vD6719beeea5a167404&page=';

export const fetchExploreData = async (pageNum: number) => {
  const url = URL_EXPLORE + pageNum;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      Notifier.showNotification({
        title: 'Oopss!',
        description: i18n.t(
          'We are updating this feature. Goback in tomorrow!',
        ),
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: 'error',
        },
      });
    }
    const {data} = await response.json(); // Convert the response to a JavaScript object
    const exploreItemModified: t_ExplorePost[] = data
      .filter((item: any) => item.default_image != null)
      .map((item: any, index: number) => ({
        id: item.id,
        content: item.answer,
        title: item.question,
        image:
          item.default_image == null
            ? 'img_default_image'
            : item.default_image.original_url,
      }));
    return exploreItemModified;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    return [];
  }
};

const Explore = () => {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const navigation =
    useNavigation<StackNavigationProp<RootParamList, 'BottomTabNavigation'>>();
  const pageRandom = useMemo(() => {
    const min = 1;
    const max = 10;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, []);
  const [listPost, setListPost] = useState<t_ExplorePost[]>([]);
  const [loading, setLoading] = useState(true);

  const handNavitoDetail = (post: t_ExplorePost) => {
    navigation.navigate('ExploreDetailScreen', {
      id: post.id,
      image: post.image,
      title: post.title,
      content: post.content,
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const exploreDataPage = await fetchExploreData(pageRandom);
      setListPost(exploreDataPage);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.bg_main}]}>
      {loading ? (
        <View style={{flex: 1, width: SCREEN_WIDTH, justifyContent: 'center'}}>
          <LottieView
            source={require('~/resources/animations/circular_loading.json')}
            autoPlay
            loop
            style={{width: '100%', height: '25%'}}
          />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.containpage}>
            {listPost.map((item, index) => (
              <View
                key={index}
                style={{
                  width: '100%',
                }}>
                <TouchableOpacity
                  style={[
                    {
                      borderWidth: 1,
                      borderColor: theme.colors.primary_dark,
                      borderRadius: 10,
                      marginBottom: 20,
                      width: '100%',
                      gap: 10,
                      paddingBottom: 10,
                    },
                  ]}
                  key={item.id}
                  onPress={() => handNavitoDetail(item)}>
                  <Image
                    resizeMode="cover"
                    source={
                      item.image === 'img_default_image'
                        ? require('~/resources/images/garden/backgroundexplore.png')
                        : {uri: item.image}
                    }
                    style={[
                      {
                        width: SCREEN_WIDTH - 40,
                        aspectRatio: 350 / 195,
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
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containpage: {
    alignItems: 'center',
    marginTop: 15,
  },
  contain: {
    borderWidth: 1,
    marginBottom: 10,
  },
  image: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'left',
    color: 'black',
  },
});
