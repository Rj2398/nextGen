import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '../utils/api';
import {useState} from 'react';


const PROFILE_ENDPOINT = 'api/v1/Academia/onboarding/institution-setup';
const ADDRESS_ENDPOINT = 'api/v1/Academia/onboarding/address-details';
const BANK_ENDPOINT = 'api/v1/Academia/onboarding/banking-setup';
const DOCUMENTS_ENDPOINT = 'api/v1/Academia/onboarding/documents';


export default function useInstitute() {
  const [manualLoading, setManualLoading] = useState(false);
    const queryClient = useQueryClient();

  // 🔹 First API
  const {mutateAsync: updatInstituteProfile} = useMutation({
    mutationKey: ['institution-setup'],
    mutationFn: async payload => {
      try {
         console.log('$$$$$$$$$',payload);
        setManualLoading(true);
        const response = await api.post(PROFILE_ENDPOINT, payload);
        return response.data;
      } catch (error) {
        const errorMessage =
          error?.message?.response?.data?.title ||
          error?.message ||
          'Something went wrong';
            console.log("$$$$$$$$$",errorMessage);
        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    }, onSuccess: () => {
      // 🔥 THIS IS THE KEY LINE
        console.log('$$$$$$$$$',"onSuccess");
      queryClient.invalidateQueries({
        queryKey: ['academia'], // partial match
      });
    },
  });

  // 🔹 Second API (different endpoint)
  const {mutateAsync: updateAddressApi} = useMutation({
    mutationKey: ['address-details'],
    mutationFn: async payload => {
      try {
         console.log('$$$$$$$$$',payload);
        setManualLoading(true);
        const response = await api.post(ADDRESS_ENDPOINT, payload);
        return response.data;
      } catch (error) {
        const errorMessage =
          error?.message?.response?.data?.title ||
          error?.message ||
          'Something went wrong';
            console.log("$$$$$$$$$",error);
        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },onSuccess: () => {
      // 🔥 THIS IS THE KEY LINE
        console.log('$$$$$$$$$',"onSuccess");
      queryClient.invalidateQueries({
        queryKey: ['academia'], // partial match
      });
    },
  });


   // 🔹 Third API (different endpoint)
  const {mutateAsync: updateBankApi} = useMutation({
    mutationKey: ['banking-setup'],
    mutationFn: async payload => {
      try {
         console.log('$$$$$$$$$',payload);
        setManualLoading(true);
        const response = await api.post(BANK_ENDPOINT, payload);
        return response.data;
      } catch (error) {
        const errorMessage =
          error?.message?.response?.data?.title ||
          error?.message ||
          'Something went wrong';
            console.log("$$$$$$$$$",error);
        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },onSuccess: () => {
      // 🔥 THIS IS THE KEY LINE
        console.log('$$$$$$$$$',"onSuccess");
      queryClient.invalidateQueries({
        queryKey: ['academia'], // partial match
      });
    },
  });


   // 🔹 Four API (different endpoint)
  const {mutateAsync: updateDocumentsApi} = useMutation({
    mutationKey: ['documents'],
    mutationFn: async payload => {
      try {
         console.log('$$$$$$$$$',payload);
        setManualLoading(true);
        const response = await api.post(DOCUMENTS_ENDPOINT, payload);
        return response.data;
      } catch (error) {
        const errorMessage =
          error?.message?.response?.data?.title ||
          error?.message ||
          'Something went wrong';
            console.log("$$$$$$$$$",error);
        throw new Error(errorMessage);
      } finally {
        setManualLoading(false);
      }
    },onSuccess: () => {
      // 🔥 THIS IS THE KEY LINE
        console.log('$$$$$$$$$',"onSuccess");
      queryClient.invalidateQueries({
        queryKey: ['academia'], // partial match
      });
    },
  });

  return {
    isLoadingupdate: manualLoading,
    updatInstituteProfile,
    updateAddressApi, // 👈 new function
    updateBankApi,
    updateDocumentsApi,
    
  };
}
