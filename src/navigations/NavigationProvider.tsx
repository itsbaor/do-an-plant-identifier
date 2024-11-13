// import analytics from '@react-native-firebase/analytics';
import {
  NavigationContainer as DefaultNavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import React, {ReactNode, memo, useRef} from 'react';
// import RNBootSplash from 'react-native-bootsplash';
import {RootParamList} from './RootNavigation';
import analytics from '@react-native-firebase/analytics';
import {useAppDispatch} from '~/hooks/useReduxStore';
import {setStateRoute} from '~/redux/slices/routeSlice';

type NavigationProviderProps = {
  children: ReactNode;
};

export const navigationRef = createNavigationContainerRef<RootParamList>();

const NavigationProvider = ({
  children,
}: NavigationProviderProps): JSX.Element => {
  const routeNameRef = useRef<string>();
  const dispatch = useAppDispatch();

  const onReady = () => {
    const currentRouteName = navigationRef.current?.getCurrentRoute?.()?.name;
    routeNameRef.current = currentRouteName;
  };

  const onStateChange = async () => {
    try {
      const previousRouteName = routeNameRef.current;
      const currentRouteName = navigationRef.current?.getCurrentRoute?.()?.name;
      console.log(currentRouteName);
      if (previousRouteName !== currentRouteName) {
        currentRouteName && dispatch(setStateRoute(currentRouteName));
        // Replace the line below to add the tracker from a mobile analytics SDK
        // Replace the line below to add the tracker from a mobile analytics SDK\
        await analytics().logScreenView({
          screen_name: currentRouteName,
          screen_class: currentRouteName,
        });
      }
      routeNameRef.current = currentRouteName;
    } catch (err) {
      console.log(`Error in NavigationContainer onStateChange() - ${err}`);
    }
  };

  return (
    <DefaultNavigationContainer<RootParamList>
      ref={navigationRef}
      onReady={onReady}
      onStateChange={onStateChange}>
      {children}
    </DefaultNavigationContainer>
  );
};

export default memo(NavigationProvider);
