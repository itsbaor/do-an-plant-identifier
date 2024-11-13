import React from 'react';
import {View, Text, Image, StyleSheet, ImageBackground} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAppTheme} from '~/resources/theme';

type HomeFunctionComponentParam = {
  title: string;
  buttonTitle: string;
  onPress: () => void;
  bgImage?: any;
  image?: any;
  content?: string;
};

const HomeFunctionComponent = ({
  title = 'What is that',
  buttonTitle = 'Click me',
  onPress,
  bgImage = null,
  content,
  image = null,
}: HomeFunctionComponentParam) => {
  const theme = useAppTheme();
  return (
    <View style={[styles.container, {}]}>
      {bgImage ? (
        <ImageBackground
          source={bgImage}
          style={{height: '100%', width: '100%'}}
          resizeMode="stretch">
          {/* <Text style={{color: "#000"}}>Haha</Text> */}
          <View
            style={{
              width: '100%',
              height: '90%',
              paddingTop: 8,
              paddingHorizontal: 8,
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {/* Left container */}
              <View style={{flex: 0.4, justifyContent: 'flex-end'}}>
                {image && (
                  <Image
                    source={image}
                    style={{width: '65%', height: '65%', marginBottom: 14}}
                    resizeMode="contain"
                  />
                )}
              </View>
              {/* Right Container */}
              <View
                style={{
                  flex: 0.6,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={[styles.textTitle]} numberOfLines={2}>
                  {title}
                </Text>
                <View style={{flex: 1, width: '80%', gap: 16}}>
                  <Text
                    style={{fontSize: 14, color: '#FFFFFF', lineHeight: 17}}
                    numberOfLines={3}>
                    {content}
                  </Text>
                  <View style={{}}>
                    <TouchableOpacity
                      onPress={onPress}
                      style={[
                        styles.button,
                        {backgroundColor: theme.colors.primary},
                      ]}>
                      <Text style={[styles.buttonText]}>{buttonTitle}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <>
          <View style={[styles.leftContainer]}>
            <Text style={[styles.textTitle]}>{title}</Text>
            <TouchableOpacity
              onPress={onPress}
              style={[styles.button, {backgroundColor: theme.colors.primary}]}>
              <Text style={[styles.buttonText]}>{buttonTitle}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.rightContainer]}>
            <Image
              style={[styles.imageStyle]}
              source={
                image ?? require('~/resources/images/home/treeDiagnose.png')
              }
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 195,
    marginTop: 15,
  },
  leftContainer: {
    paddingTop: 26,
    paddingBottom: 35,
    justifyContent: 'space-between',
    width: 150,
    gap: 18,
  },
  rightContainer: {
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    overflow: 'hidden',
    height: 194,
    width: 178,
  },
  textTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'left',
    fontWeight: '700',
    // textOverflow: "ellipsis",
    // whiteSpace: "nowrap",
  },
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default HomeFunctionComponent;
