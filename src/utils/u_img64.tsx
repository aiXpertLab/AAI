// src/utils/logoUtils.ts
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { fetchAPIUrl } from "@/src/utils/fetchAPIUrl"; // Adjust the import path as needed
import { useInvStore } from '@/src/stores/InvStore';
import { ItemDB } from '../types';


export const uploadB64 = async () => {

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
        Alert.alert("Permission to access media library is required!");
        return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: true,
    });

    if (!pickerResult.canceled && pickerResult.assets?.[0]?.base64) {
        return pickerResult.assets[0].base64;
    }

    return;
};

export const cameraB64 = async () => {
    // Request permission
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();

    if (!granted) {
        Alert.alert("Permission required to take a picture.");
        return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        base64: true,
    });

    if (!result.canceled && result.assets?.[0]?.base64) {
        return result.assets[0].base64;
    }

    console.log("User cancelled camera");
    return;
};


export const processB64Client = async (
    base64Image: string | undefined,
    updateOClient: (data: any) => void,
    setIsProcessing: (val: boolean) => void
) => {
    if (!base64Image) { alert("Error: No image data available."); return; }

    const apiBase = await fetchAPIUrl();
    const apiUrl = apiBase + 'aai/image_client_json';
    if (!apiUrl) { console.error("No API URL available"); return; }

    setIsProcessing(true);
    try {
        const response = await axios.post(apiUrl, { base64_image: base64Image });
        const json = response.data.data;
        const parsed = JSON.parse(json);

        updateOClient({
            client_company_name: parsed.client_business_name || 'Unknown Company',
            client_contact_name: parsed.client_contact_name || 'Unknown Contact',
            client_contact_title: parsed.client_contact_title || 'Manager',
            client_address: parsed.client_address || 'No address provided',
            client_email: parsed.client_email || 'No email provided',
            client_mainphone: parsed.client_phone || 'No phone provided',
            client_website: parsed.client_website || 'No website provided',
            client_currency: parsed.client_currency || 'Currency not specified',
            client_note: parsed.client_note || 'No notes available',
        });
    } catch (err) {
        console.error(err);
        Alert.alert("Error: Failed to process. Please try again later.");
    } finally {
        setIsProcessing(false);
    }
};


export const processB64Inv = async (
    base64Image: string | undefined,
    setIsProcessing: (val: boolean) => void
) => {
    if (!base64Image) { alert("Error: No image data available."); return; }

    const updateOInv = useInvStore.getState().updateOInv;

    const apiBase = await fetchAPIUrl();
    const apiUrl = apiBase + 'aai/image_invoice_json';
    if (!apiUrl) { console.error("No API URL available"); return; }

    setIsProcessing(true);
    try {
        const response = await axios.post(apiUrl, { base64_image: base64Image });
        const json = response.data.data;
        const parsed = JSON.parse(json);
        // console.log(parsed)

        updateOInv({

            inv_due_date: parsed.due_date,
            inv_date: parsed.issue_date,
            inv_number: parsed.invoice_number,
            inv_reference: parsed.reference,
            inv_subtotal: parsed.invoice_subtotal,
            inv_tax_amount: parsed.invoice_tax_amount,
            inv_tax_label: parsed.invoice_tax_label,
            inv_total: parsed.invoice_total,

            // biz_name: parsed.my_business_name,
            // biz_address: parsed.my_business_address,
            // biz_phone: parsed.my_business_phone,
            //  "item_list": [{"item_name": "Luma Analog Watch", "quantity": 1, "sku": "24-WG09", "subtotal": 43},
            //  {"item_name": "Fusion Backpack", "quantity": 1, "sku": "24-MB02", "subtotal": 50}], 
            // 
            // client_company_name: parsed.client_business_name || 'Unknown Company',
            // client_contact_name: parsed.client_contact_name || 'Unknown Contact',
            // client_address: parsed.client_address || 'No address provided',
            // client_email: parsed.client_email || 'No email provided',
            // client_mainphone: parsed.client_phone || 'No phone provided',
            // client_currency: parsed.client_currency || 'Currency not specified',
        });

        const formattedItems = (parsed.item_list || [])
            .filter((item: any) => item.item_name && item.item_name.trim() !== '')
            .map((item: any, index: number) => ({
                id: index + 1,
                item_name: item.item_name,
                item_quantity: item.quantity,
                item_rate: item.subtotal
            }));

        if (formattedItems.length > 0) {
            setOInvItemList(formattedItems);
        }

    } catch (err) {
        console.error(err);
        alert("Error: Failed to process. Please try again later.");
    } finally {
        setIsProcessing(false);
    }
};


export const processB64Me = async (
    base64Image: string | undefined,
    updateOBiz: (data: any) => void,
    updateOInv: (data: any) => void,
    setIsProcessing: (val: boolean) => void
) => {
    if (!base64Image) { alert("Error: No image data available."); return; }

    const apiBase = await fetchAPIUrl();
    const apiUrl = apiBase + 'aai/image_client_json';
    if (!apiUrl) { console.error("No API URL available"); return; }

    setIsProcessing(true);
    try {
        const response = await axios.post(apiUrl, { base64_image: base64Image });
        const json = response.data.data;
        const parsed = JSON.parse(json);

        updateOBiz({
            biz_name: parsed.client_business_name || 'a Unknown ',
            biz_address: parsed.client_address || 'Unknown ',
            biz_email: parsed.client_email || 'Unknown ',
            biz_phone: parsed.client_phone || 'No phone provided',
            biz_website: parsed.client_website || 'No website provided',
            biz_currency: parsed.client_currency || 'Currency not specified',
        });
        updateOInv({
            biz_name: parsed.client_business_name || 'f Unknown ',
            biz_address: parsed.client_address || 'Unknown ',
            biz_email: parsed.client_email || 'Unknown ',
            biz_phone: parsed.client_phone || 'No phone provided',
            biz_website: parsed.client_website || 'No website provided',
            biz_currency: parsed.client_currency || 'Currency not specified',
        });
    } catch (err) {
        console.error(err);
        alert("Error: Failed to process. Please try again later.");
    } finally {
        setIsProcessing(false);
    }
};


// export const processB64Item = async (
//     base64Image: string | undefined,
//     updateOItem: (data: any) => void,
//     setIsProcessing: (val: boolean) => void
// ) => {
//     if (!base64Image) { alert("Error: No image data available."); return; }

//     const apiBase = await fetchAPIUrl();
//     const apiUrl = apiBase + 'aai/image_item_json';
//     if (!apiUrl) { console.error("No API URL available"); return; }

//     setIsProcessing(true);
//     try {
//         const response = await axios.post(apiUrl, { base64_image: base64Image });
//         const json = response.data.data;
//         const parsed = JSON.parse(json);
//         console.log(parsed)
//         // parsed = {"items": [{"item_description": "Brochure design - Single sided (Color)", "item_name": "Brochure Design", "item_rate": 900, "item_sku": null, "item_unit_of_measure": "1.00"}, {"item_description": "10 Pages, Slider, Free Logo, Dynamic Website, Free Domain, Hosting Free for 1st year", "item_name": "Web Design packages (Simple)", "item_rate": 10000, "item_sku": null, "item_unit_of_measure": "1.00"}, {"item_description": "A full-page ad, Nationwide Circulation (Colour)", "item_name": "Print Ad - Newspaper", "item_rate": 7500, "item_sku": null, "item_unit_of_measure": "1.00"}]}


//         updateOItem({            
//             item_name: parsed.item_name || 'Unknown Item',
//             item_description: parsed.item_description || 'No description provided',
//             item_sku: parsed.item_quantity || "No SKU provided",
//             item_rate: parsed.item_rate || 0,
//         });
//     } catch (err) {
//         console.error(err);
//         Alert.alert("Error: Failed to process. Please try again later.");
//     } finally {
//         setIsProcessing(false);
//     }
// };

export const processB64Item = async (
    base64Image: string | undefined,
    setIsProcessing: (val: boolean) => void
): Promise<ItemDB[] | null> => {
    if (!base64Image) { alert("Error: No image data."); return null; }

    const apiBase = await fetchAPIUrl();
    const apiUrl = apiBase + 'aai/image_item_json';
    setIsProcessing(true);

    try {
        const response = await axios.post(apiUrl, { base64_image: base64Image });
        const json = response.data.data;
        const parsed = JSON.parse(json);
        return parsed.items as ItemDB[];
    } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to process image.");
        return null;
    } finally {
        setIsProcessing(false);
    }
};