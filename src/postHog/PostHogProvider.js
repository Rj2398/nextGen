import PostHog, {PostHogProvider} from 'posthog-react-native';

export const posthogClient = new PostHog(
  'phc_lBD5i9ioaA17ljoq18xN4svma08eN2WLMq5yfIfXjBW',
  {
    host: 'https://us.i.posthog.com',
    autocapture: false,
  },
);

//

// 2. This is the wrapper that goes in App.js
export const PostHogConfig = ({children}) => {
  return <PostHogProvider client={posthogClient}>{children}</PostHogProvider>;
};
