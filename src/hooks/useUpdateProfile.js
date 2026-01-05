

import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '../utils/api';
import {useState} from 'react';
import store from '../store';

const PROFILE_ENDPOINT = "api/v1/Profile/user";

export default function useUpdateProfile() {
  const [manualLoading, setManualLoading] = useState(false);
  const { userInfo } = store.getState().user;
  const userId = userInfo?.user?.id;
 const queryClient = useQueryClient();
  const {mutateAsync: updatProfile, } = useMutation({
    mutationKey: ['Profile/user', 'user'],
    mutationFn: async payload => {
      try {
         console.log('$$$$$$$$$',payload);
        setManualLoading(true);
        const response = await api.put(PROFILE_ENDPOINT, payload,{
          headers: {
          'Content-Type': 'multipart/form-data',
          },
        });
      console.log('$$$$$$$$$',response);
        const {data} = response
        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
        const errorMessage = error.message || 'An unknown error occurred';
        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },onSuccess: () => {
      // 🔥 THIS IS THE KEY LINE
        console.log('$$$$$$$$$',"onSuccess");
      queryClient.invalidateQueries({
        queryKey: ["profile", userId], // partial match
      });
    },
  });

  const isLoadingupdate = manualLoading;
  return {
    isLoadingupdate, 
    updatProfile
  };
}
