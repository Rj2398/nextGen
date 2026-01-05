

import {useMutation} from '@tanstack/react-query';
import {api} from '../utils/api';
import {useState} from 'react';
import store from '../store';

const PROFILE_ENDPOINT = 'api/v1/Academia/onboarding/institution-setup';

export default function updateInstitute() {
  const [manualLoading, setManualLoading] = useState(false);
  const {mutateAsync: updatInstituteProfile, } = useMutation({
    mutationKey: ['institution-setup'],
    mutationFn: async payload => {
      try {
         console.log('$$$$$$$$$',payload);

        setManualLoading(true);
        const response = await api.post(PROFILE_ENDPOINT, payload);
     console.log('$$$$$$$$$',response);
        const {data} = response
        return {
          ...data,
          message: data?.message,
        };
      } catch (error) {
      //  const errorMessage = error.message || 'An unknown error occurred';
        const errorMessage = error?.message?.response?.data?.title ||  error.message ||  'Something went wrong';
           console.log("$$$$$$$$$",errorMessage);
        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },
  });


//   ,{
//           headers: {
//           'Content-Type': 'multipart/form-data',
//           },
//         }

  const isLoadingupdate = manualLoading;
  return {
    isLoadingupdate, 
    updatInstituteProfile
  };
}
