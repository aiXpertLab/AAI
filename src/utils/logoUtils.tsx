// src/utils/logoUtils.ts
import * as ImagePicker from 'expo-image-picker';
import { SQLiteDatabase } from 'expo-sqlite';
import Toast from 'react-native-toast-message';
import { useBizStore, useInvStore } from '@/src/stores/useInvStore';
import * as FileSystem from "expo-file-system";

export const saveLogoToDB = async (db: SQLiteDatabase, uri: string, b64:string) => {
    try {
        await db.runAsync('UPDATE biz SET biz_logo = ?, biz_logo64=? WHERE me = ?', [uri,b64, 'meme']);
        Toast.show({ type: 'success', text1: 'Logo Saved!', text2: "Your logo has been updated.", position: 'bottom' });
    } catch (err) {
        console.error("Error saving logo:", err);
        Toast.show({ type: 'error', text1: 'Failed to Save Logo', text2: "An error occurred.", position: 'bottom' });
    }
};

export const pickAndSaveLogo = async (db: SQLiteDatabase) => {
    const { updateOBiz } = useBizStore.getState();
    const { updateOInv } = useInvStore.getState();

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
        alert("Permission to access media library is required!");
        return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: false,
    });

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
        const uri = pickerResult.assets[0].uri;

        try {
            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64, });
            const mimeType = pickerResult.assets[0].mimeType || "image/jpeg";
            const dataUri64 = `data:${mimeType};base64,${base64}`;
            
            updateOBiz({ biz_logo: uri, biz_logo64: dataUri64 });
            updateOInv({ biz_logo: uri, biz_logo64: dataUri64 });
            await saveLogoToDB(db, uri, dataUri64);
        } catch (error) {
            console.error("Failed to convert logo to base64:", error);
        }
    };
};
