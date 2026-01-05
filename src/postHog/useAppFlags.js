import {usePostHog} from 'posthog-react-native';

export const useAppFlags = () => {
  const posthog = usePostHog();

  const isFeatureEnabled = flag => {
    try {
      // Check if flags are even loaded yet
      if (!posthog?.receivedFeatureFlags()) return false;
      return Boolean(posthog?.isFeatureEnabled(flag));
    } catch {
      return false;
    }
  };

  return {isFeatureEnabled};
};
