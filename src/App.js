import React, {useEffect, useRef, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Provider, useDispatch} from 'react-redux';
import {View, LogBox} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import store from './store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUserInfo} from './store/slices/userSlice';
import {KEYS} from './config/constant';

import Routes from './routes/Index';
import NoInternet from './views/components/Nointernet';
// import './config/i18n/i18n'; //for lanaguge

const queryClient = new QueryClient();

const AppComponent = () => {
  const dispatch = useDispatch();

  LogBox.ignoreAllLogs(true);

  const navigationRef = useRef();
  const isReadyRef = useRef();

  // NOTE: I've removed the separate subscribeToConnectivity function
  // as the logic is fully contained and cleaned up in the main useEffect.

  const [internetConnectivity, setInternetActivity] = useState(true);

  // ⚠️ Best Practice Improvement: Combined async logic into a dedicated useEffect hook.
  useEffect(() => {
    let isMounted = true;

    // --- NetInfo Subscription and Cleanup ---
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      // Only update state if the component is mounted
      if (isMounted) {
        setInternetActivity(state.isConnected ?? true);
      }
    });

    // --- AsyncStorage Fetch ---
    const fetchUserData = async () => {
      try {
        const userInfo = JSON.parse(await AsyncStorage.getItem(KEYS.USER_INFO));
        if (userInfo && isMounted) {
          dispatch(setUserInfo(userInfo));
        }
      } catch (error) {
        console.error('Error in getting USER_INFO', error);
      }
    };

    fetchUserData();

    // --- Cleanup Function ---
    return () => {
      isMounted = false; // Prevent state updates after unmount
      unsubscribeNetInfo(); // Clean up the NetInfo listener
    };
  }, [dispatch]);

  return (
    <View style={{flex: 1}}>
      <Routes navigationRef={navigationRef} isReadyRef={isReadyRef} />
      {/* ⚠️ FIX: Updated component name to use PascalCase */}
      {!internetConnectivity && <NoInternet resetToSplashScreen={() => {}} />}
    </View>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AppComponent />
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
