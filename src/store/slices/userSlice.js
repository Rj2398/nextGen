import {createSlice} from '@reduxjs/toolkit';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {KEYS} from '../../config/constant';

const initialState = {
  userInfo: null,
  firstTimeUser: null,
  storeEmailOrOtp: null,
  locationEnable: false,
  notifictionStatus: false,
  userProfileDetails: null,
  toggleLoc: false,
  toggleRefresh: false,
  clientIDstore: null,
  endShiftStoreData: 0,
  roundStampID: null,
  onGoingShow: false,
  removeOnGoing: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      // if (!state?.userInfo?.token || !state?.token) {
      //   AsyncStorage.removeItem(KEYS.USER_INFO);
      // }
    },
    firstTimeUser: (state, action) => {
      state.firstTimeUser = action.payload;
    },
    setShowOngoing: (state, action) => {
      state.onGoingShow = action.payload;
    },
    setRemoveOnGoing: (state, action) => {
      state.removeOnGoing = action.payload;
    },
    setEmailorOtp: (state, action) => {
      state.storeEmailOrOtp = action.payload;
    },
    setRefresh: (state, action) => {
      state.toggleRefresh = !state.toggleRefresh;
    },
    setLocationEnable: (state, action) => {
      state.locationEnable = action.payload;
    },
    setroundTimeStampID: (state, action) => {
      state.roundStampID = action.payload;
    },

    setNotificationEnable: (state, action) => {
      state.notifictionStatus = action.payload;
    },
    setUserProfileDetail: (state, action) => {
      state.userProfileDetails = action.payload;
    },
    setToggleLocation: (state, action) => {
      state.toggleLoc = action.payload;
    },
    endShitfStore: (state, action) => {
      state.endShiftStoreData = action.payload;
    },

    setClientIdStore: (state, action) => {
      state.clientIDstore = action.payload;
    },
    clearUser: state => {
      state.userInfo = null;
      state.firstTimeUser = null;
      state.storeEmailOrOtp = null;
      AsyncStorage.removeItem(KEYS.USER_INFO);
    },
  },
});

export const {
  setUserInfo,
  clearUser,
  firstTimeUser,
  setEmailorOtp,
  setToggleLocation,
  setLocationEnable,
  setNotificationEnable,
  setUserProfileDetail,
  setRefresh,
  setClientIdStore,
  endShitfStore,
  setroundTimeStampID,
  setShowOngoing,
  setRemoveOnGoing,
} = userSlice.actions;

export default userSlice.reducer;
