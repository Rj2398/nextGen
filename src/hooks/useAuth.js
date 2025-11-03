import {useDispatch} from 'react-redux';
import {useMutation} from '@tanstack/react-query';
import {
  clearUser,
  firstTimeUser,
  setUserInfo,
  setEmailorOtp,
} from '../store/slices/userSlice';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {api, guestApi} from '../utils/api';
import {KEYS} from '../config/constant';
import {useState} from 'react';
import {err} from 'react-native-svg/lib/typescript/xml';

export default function useAuth() {
  const dispatch = useDispatch();

  const [manualLoading, setManualLoading] = useState(false);

  const {mutateAsync: loginUser} = useMutation({
    mutationKey: ['login', 'user'],
    mutationFn: async payload => {
      try {
        setManualLoading(true);
        const response = await api.post('login', payload);
        const {data} = response;
        // console.log(payload, 'payload data comes fromt this');

        // console.log(data, 'data comes after login data');
        const access_token = data?.token;
        const user_id = data?.data?.id;

        if (access_token) {
          // Save user data to AsyncStorage
          await AsyncStorage.setItem(
            KEYS.USER_INFO,
            JSON.stringify({
              access_token,
              user_id,
            }),
          );

          // Dispatch user info to Redux store after a slight delay
          setTimeout(() => {
            dispatch(setUserInfo(data?.data));
          }, 1000);
        }

        // Return the data along with any relevant messages
        return {
          ...data,
          message: data?.data?.message,
        };
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || // Custom error from API
          error.message || // Default error message
          'An unknown error occurred';
        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  //
  const {mutateAsync: verifyEmail} = useMutation({
    mutationKey: ['first_time_guard', 'email'],
    mutationFn: async payload => {
      try {
        setManualLoading(true);
        const response = await api.post('first_time_guard', payload);
        const {data} = response;
        // console.log(data.data?.first_time, 'comes formt jjldsjf');

        // Dispatch user info to Redux store after a slight delay

        dispatch(firstTimeUser(data?.data?.first_time));

        // Return the data along with any relevant messages
        return {
          ...data?.data,
        };
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || // Custom error from API
          error.message || // Default error message
          'An unknown error occurred';
        // console.log(errorMessage, 'error message');
        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });
  //
  const {mutateAsync: logoutUser} = useMutation({
    mutationKey: [`login`, 'logout'],
    mutationFn: async payload => {
      setManualLoading(true); // Set loading to true before making the request

      try {
        const {data} = await guestApi.post('logout', payload);

        setManualLoading(false);

        dispatch(clearUser());

        return data?.data;
      } catch (error) {
        console.error('Logout failed:', error);

        setManualLoading(false);

        dispatch(clearUser());

        throw error;
      } finally {
        setManualLoading(false);
      }
    },
  });
  //
  const {mutateAsync: forgotPassword} = useMutation({
    mutationKey: [`forgot-password`, 'logout'],
    mutationFn: async payload => {
      try {
        setManualLoading(true);
        const response = await api.post('forgot-password', payload);
        const {data} = response;

        dispatch(setEmailorOtp(data?.data));
        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        throw new Error(error.message);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const {mutateAsync: verifyOtp} = useMutation({
    mutationKey: [`verify-otp`, 'logout'],
    mutationFn: async payload => {
      try {
        setManualLoading(true);
        const response = await api.post('verify-otp', payload);
        // console.log(payload, 'verify otp params');
        const {data} = response;

        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        console.log(error, 'error message codes');
        const errorMessage =
          error.response?.data?.message || // Custom error from API
          error.message || // Default error message
          'An unknown error occurred';

        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });
  //

  // reset password

  const {mutateAsync: resetPassword} = useMutation({
    mutationKey: [`reset-password`, 'logout'],
    mutationFn: async payload => {
      try {
        setManualLoading(true);
        const response = await api.post('reset-password', payload);
        // console.log(payload, 'paylad daaddddd');

        const {data} = response;

        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        console.log(error, 'error message codes');
        const errorMessage =
          error.response?.data?.message || // Custom error from API
          error.message || // Default error message
          'An unknown error occurred';

        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  //

  const {mutateAsync: resendOtp} = useMutation({
    mutationKey: [`resend-otp`, 'logout'],
    mutationFn: async payload => {
      try {
        setManualLoading(true);
        const response = await api.post('resend-otp', payload);

        const {data} = response;

        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        console.log(error, 'error message codes');
        const errorMessage =
          error.response?.data?.message || // Custom error from API
          error.message || // Default error message
          'An unknown error occurred';

        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });
  //

  const {mutateAsync: changePassword} = useMutation({
    mutationKey: [`change-password`, 'changepass'],
    mutationFn: async payload => {
      try {
        setManualLoading(true);
        const response = await guestApi.post('change-password', payload);

        const {data} = response;

        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        console.log(error, 'error message codes');
        const errorMessage =
          error.response?.data?.message || // Custom error from API
          error.message || // Default error message
          'An unknown error occurred';

        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  ///

  const {mutateAsync: DeleteAccount} = useMutation({
    mutationKey: [`delete-account`, 'delete-account'],
    mutationFn: async payload => {
      try {
        setManualLoading(true);
        const response = await guestApi.post('delete-account', payload);

        const {data} = response;

        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        console.log(error, 'error message codes');
        const errorMessage =
          error.response?.data?.message || // Custom error from API
          error.message || // Default error message
          'An unknown error occurred';

        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  //

  const {mutateAsync: UserExistORNot} = useMutation({
    mutationKey: [`check-guard-exit-or-not`, 'delete-account11'],
    mutationFn: async payload => {
      try {
        setManualLoading(true);
        const response = await guestApi.post(
          'check-guard-exit-or-not',
          payload,
        );

        const {data} = response;

        return {
          ...data?.data,
        };
      } catch (error) {
        setManualLoading(false);
        console.log(error, 'error message codes');
        const errorMessage =
          error.response?.data?.message || // Custom error from API
          error.message || // Default error message
          'An unknown error occurred';

        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });

  const isLoading = manualLoading;
  return {
    loginUser,
    logoutUser,
    verifyEmail,
    forgotPassword,
    verifyOtp,
    isLoading,
    resetPassword,
    resendOtp,
    changePassword,
    DeleteAccount,
    UserExistORNot,
  };
}
