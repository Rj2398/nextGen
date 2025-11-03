// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import {KEYS, baseURL} from '../config/constant';
// import {clearUser} from '../store/slices/userSlice';
// import store from '../store';

// const api = axios.create({
//   baseURL,
// });

// // Request Interceptor
// api.interceptors.request.use(
//   async config => {
//     const {userInfo} = store.getState().user;
//     let token = userInfo?.token;

//     const savedUser = await AsyncStorage.getItem(KEYS.USER_INFO);
//     const storedUser = savedUser ? JSON.parse(savedUser) : null;
//     token = storedUser?.access_token || token;

//     // ✅ Attach token if exists
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // ✅ Auto-detect FormData
//     if (config.data instanceof FormData) {
//       config.headers['Content-Type'] = 'multipart/form-data';
//     } else {
//       config.headers['Content-Type'] = 'application/json';
//     }

//     return config;
//   },
//   error => Promise.reject(error),
// );

// // Response Interceptor
// api.interceptors.response.use(
//   response => response,
//   error => {
//     const customError = {
//       message:
//         error.response?.data?.data?.message ||
//         'Something went wrong. Please try again later.',
//       status: error.response?.status,
//     };

//     // ✅ Auto logout on 401
//     if (error.response?.status === 401) {
//       store.dispatch(clearUser());
//     }

//     return Promise.reject(customError);
//   },
// );

// export {api};
//

//for refresh token code

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {KEYS, baseURL} from '../config/constant';
import {clearUser} from '../store/slices/userSlice';
import store from '../store';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const api = axios.create({baseURL});

// ✅ Request Interceptor
api.interceptors.request.use(async config => {
  const user = store.getState().user.userInfo;
  const savedUser = JSON.parse(await AsyncStorage.getItem(KEYS.USER_INFO));

  const token = savedUser?.access_token || user?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  } else {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

// ✅ Response Interceptor (Refresh Token Logic)
api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    // If unauthorized → try refresh token
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({resolve, reject});
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const savedUser = JSON.parse(
          await AsyncStorage.getItem(KEYS.USER_INFO),
        );
        const refreshToken = savedUser?.refresh_token;

        if (!refreshToken) throw err;

        // ✅ Call refresh token API
        const response = await axios.post(`${baseURL}/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = response.data?.access_token;
        const newRefreshToken = response.data?.refresh_token;

        // ✅ Save tokens
        await AsyncStorage.setItem(
          KEYS.USER_INFO,
          JSON.stringify({
            ...savedUser,
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
          }),
        );

        processQueue(null, newAccessToken);

        // ✅ Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // ❌ Refresh token failed → logout
        store.dispatch(clearUser());
        await AsyncStorage.removeItem(KEYS.USER_INFO);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  },
);

export {api};
