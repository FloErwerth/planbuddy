export default {
  expo: {
    extra: {
      eas: {
        projectId: 'ddcf8e81-e61c-4947-81a1-527ddc53e685',
      },
    },
    name: 'planbuddy',
    slug: 'planbuddy',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'planbuddy',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      bundleIdentifier: 'de.florian.erwerth.planbuddy',
      supportsTablet: false,
    },
    android: {
      package: 'de.florian.erwerth.planbuddy',
      adaptiveIcon: {
        backgroundColor: '#ffffff',
      },
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'https',
              host: 'events-with-friends-9e33b.web.app',
              pathPrefix: '/joinEvent/*',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    plugins: [
      'expo-router',
      [
        'expo-image-picker',
        {
          photosPermission: 'The app accesses your photos to let you share them with your friends.',
        },
      ],
      'expo-font',
      [
        '@sentry/react-native/expo',
        {
          url: 'https://sentry.io/',
          project: 'planbuddy-app',
          organization: 'florian-erwerth',
        },
      ],
      [
        'react-native-share',
        {
          ios: ['fb', 'instagram', 'twitter', 'tiktoksharesdk'],
          android: [
            'com.facebook.katana',
            'com.instagram.android',
            'com.twitter.android',
            'com.zhiliaoapp.musically',
          ],
          enableBase64ShareAndroid: true,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
