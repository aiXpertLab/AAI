// src/utils/logoUtils.ts
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { BE_DB } from '@/src/types';
import * as FileSystem from "expo-file-system";
import * as ImagePicker from 'expo-image-picker';

import { useBizStore } from '@/src/stores/BizStore';
import { useBizCrud } from '@/src/firestore/fs_crud_biz';
import { use } from 'react';

const CLOUD_NAME = 'dbysasiob';
const UPLOAD_PRESET = 'aiailogo';

const showToast = (type: 'success' | 'error', title: string, message: string) => {
    Toast.show({ type, text1: title, text2: message, position: 'bottom' });
};

export const pickAndSaveLogo = async (
    updateBiz: (biz: Partial<BE_DB>,
        onSuccess: () => void,
        onError: (err: any) => void) => Promise<void>,
    updateOBiz: (biz: Partial<BE_DB>) => void
) => {
    console.log("pickAndSaveLogo called1");
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("pickAndSaveLogo called12");
    if (!permissionResult.granted) {
        alert("Permission to access media library is required!");
        return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
    });

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
        const localUri = pickerResult.assets[0].uri;

        try {
            // Prepare file data for Cloudinary upload
            const formData = new FormData();
            formData.append('file', {
                uri: localUri,
                type: 'image/jpeg', // or pickerResult.assets[0].type || 'image/jpeg'
                name: 'logo.jpg',
            } as any);
            formData.append('upload_preset', UPLOAD_PRESET);

            // Upload to Cloudinary
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            const cloudinaryUrl = response.data.secure_url;

            // Update Zustand (local state)
            updateOBiz({ be_logo: cloudinaryUrl });

            // Update Firestore (remote)
            await updateBiz(
                { be_logo: cloudinaryUrl },
                () => showToast('success', 'Logo Saved!', 'Your logo has been updated.'),
                (err) => showToast('error', 'Failed to Save Logo', 'An error occurred.')
            );

        } catch (error) {
            console.error("Cloudinary upload failed:", error);
            showToast('error', 'Upload Failed', 'Could not upload image to Cloudinary.');
        }
    }
};