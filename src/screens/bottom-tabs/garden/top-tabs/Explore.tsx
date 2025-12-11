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
import {fetchArticlesFromBackend} from '~/services/articleService';

export type t_ExplorePost = {
  id: string;
  content: string;
  title: string;
  image: string;
};

export const fetchExploreData = async (limit: number = 20, offset: number = 0) => {
  try {
    const result = await fetchArticlesFromBackend(undefined, limit, offset);

    if (!result.success || !result.data) {
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
      return [];
    }

    // Map backend articles to the existing t_ExplorePost structure
    const exploreItemModified: t_ExplorePost[] = result.data
      .filter((article) => article.image_url != null)
      .map((article) => ({
        id: String(article.id),
        content: article.content,
        title: article.title,
        image: article.image_url || 'img_default_image',
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
      const exploreDataPage = await fetchExploreData(20, 0);
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
