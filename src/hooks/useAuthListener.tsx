// src/hooks/useAuthListener.ts
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/src/config/firebaseConfig';
import { useFirebaseUserStore } from '@/src/stores/FirebaseUserStore';
import { checkBizEntityExists } from '@/src/utils/bizUtils'; // implement this

export default function useAuthListener() {
    const setFirebaseUser = useFirebaseUserStore((s) => s.setFirebaseUser);
    const firebaseUser = useFirebaseUserStore((s) => s.FirebaseUser);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const bizEntityExists = await checkBizEntityExists(user.uid);
                // const { isBizCreated } = useFirebaseUserStore.getState();   

                if (bizEntityExists) {
                    setFirebaseUser(user);
                } else {
                    console.log('User logged in but no biz entity yet.');
                    // Optionally: store user temporarily, or wait
                }
            } else {
                setFirebaseUser(null);
            }
        });

        return () => unsubscribe();
    }, []);
}
