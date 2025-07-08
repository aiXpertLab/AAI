import * as Google from 'expo-auth-session/providers/google';
import { auth } from '@/src/config/firebaseConfig';
import { useEffect } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

export function useGoogleAuth(navigation: any) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => navigation.navigate('MainDrawer'))
        .catch((err) => console.log('Google Sign-In Error:', err));
    }
  }, [response]);

  return { promptAsync };
}
