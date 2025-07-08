import * as Google from 'expo-auth-session/providers/google';
import { auth } from '@/src/config/firebaseConfig';
import * as AuthSession from 'expo-auth-session';
import { useEffect } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

export function useGoogleAuth(navigation: any) {
    const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'aiaa',
    });

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '497498007772-r8759r8b9ssb12imubj77tgk9np0tpd8.apps.googleusercontent.com',
        webClientId: '497498007772-f6gaje06h9beracmiadpa1gfhisgoncb.apps.googleusercontent.com',
        redirectUri,
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
