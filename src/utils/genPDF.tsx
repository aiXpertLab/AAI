// utils/exportPDF.js
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';
import * as MailComposer from 'expo-mail-composer';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system';
import { genHTML } from './genHTML'; // Adjust path to your HTML generator

export const genPDF = async (oInv: any, oBiz: any, oInvItemList: any) => {
    if (!oInv) throw new Error("Missing invoice data");

    const htmlContent = genHTML(oInv, oBiz, oInvItemList, "pdf", oInv.biz_inv_template_id || "t1");
    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    return uri;
};


// export const viewPDF = async (uri: any) => {
//     console.log('viewpdf--- ', uri)
//     if (!uri) throw new Error("No PDF URI provided");
//     await WebBrowser.openBrowserAsync(uri);
// };
export const openWithExternalPDFViewer = async (uri: string) => {
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) throw new Error("Sharing not available on this device");

    await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Open PDF with...',
    });
};

// export const viewPDF = async (uri: string) => {
//     if (!uri) throw new Error("No PDF URI provided");

//     await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
//         data: uri,
//         flags: 1,
//         type: "application/pdf",
//     });
// };


export const viewPDF = async (uri: string) => {
    if (!uri) throw new Error("No PDF URI provided");

    try {
        // Convert file URI to content URI (Android)
        const contentUri = await FileSystem.getContentUriAsync(uri);

        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
            data: contentUri,
            flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
            type: "application/pdf",
        });
    } catch (error) {
        console.error("Error viewing PDF:", error);
        throw error;
    }
};


export const sharePDF = async (uri: any) => {
    if (!uri) throw new Error("No PDF URI provided");

    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
        console.log("Shared PDF successfully");
    } else {
        throw new Error("Sharing is not available");
    }
};


// utils/emailPDF.js

export const emailPDF = async (uri: any, oInv: any) => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
        throw new Error("Mail composer not available");
    }

    try {
        await MailComposer.composeAsync({
            recipients: [oInv?.client_email!],
            subject: `Invoice from ${oInv?.biz_name}`, // Dynamic business name
            body: `Dear ${oInv?.client_contact_name},\n\nPlease find your invoice attached.\n\nBest regards,\n${oInv!.biz_name}`,
            attachments: [uri],
        });
    } catch (err) {
        console.error('Error sending email:', err);
        alert('Failed to send email.');
    }
};
