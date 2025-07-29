import { serverTimestamp } from "firebase/firestore";

export const getMyBizSeed = () => ({
    biz_name: 'My Corporation 1',
    biz_email: 'change@meme.com',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
});


