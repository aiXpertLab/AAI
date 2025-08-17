import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Share, Linking, Alert } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useFirebaseUserStore } from '@/src/stores/FirebaseUserStore';
import { useBizCrud } from "@/src/firestore/fs_crud_biz";

import { Ionicons } from '@expo/vector-icons';
import { s_global } from "@/src/constants";
import { auth } from '@/src/config/firebaseConfig';

// Define a more specific type for Ionicons names
type IoniconName = "help-circle-outline" | "sync-outline" | "star-outline" | "gift-outline" | "cloud-upload-outline" | "share-social-outline" | "mail-outline" | "settings-outline";

const CustomDrawerContent = (props: any) => {
    const setFirebaseUser = useFirebaseUserStore((s) => s.setFirebaseUser);
    const { backupAll } = useBizCrud()


    const handleShareApp = async () => {
        try {
            await Share.share({
                message: 'Check out AI Auto Invoicing! https://play.google.com/store/apps/details?id=com.aixpertlab.aiautoinvoicing&pcampaignid=web_share',
            });
        } catch (error) {
            Alert.alert('Error', 'Could not share app.');
        }
    };

    const handleSignIn = () => {
        props.navigation.navigate('DetailStack', { screen: 'Sign' });
    };

    const handleRateUs = () => {
        Linking.openURL('market://details?id=com.aixpertlab.aiautoinvoicing').catch(() => {
            Alert.alert('Error', 'Could not open app store.');
        });
    };

    const handlePrivacyPolicy = () => {
        Linking.openURL('https://aiautoinvoicing.github.io/pp.html').catch(() => {
            Alert.alert('Error', 'Could not open app store.');
        });
    };

    const handleBackup = async () => {
        try {
            // 1. Grab Firestore data
            const backup = await backupAll();
            if (!backup) {
                Alert.alert("Backup Failed", "No data found to backup.");
                return;
            }

            // 2. Save to JSON file
            const path = FileSystem.documentDirectory + "biz_backup.json";
            await FileSystem.writeAsStringAsync(
                path,
                JSON.stringify(backup, null, 2) // pretty print
            );

            // 3. Share JSON file
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(path);
            } else {
                Alert.alert("Error", "Sharing not available on this device.");
            }
        } catch (err: any) {
            console.error("Backup failed:", err);
            Alert.alert("Error", "Could not complete backup.");
        }
    };


    const handleDelete = () => {
        props.navigation.navigate('DetailStack', {
            screen: 'RestoreScreen',
            params: { mode: 'restore_deleted' }
        })
    };

    const handleArchive = () => {
        props.navigation.navigate('DetailStack', {
            screen: 'RestoreScreen',
            params: { mode: 'restore_archived' }
        })
    };

    const handleSupport = () => {
        props.navigation.navigate('DetailStack', { screen: 'SupportHub' });
    };

    const handleContactUs = () => {
        const email = 'aiautoinvoicing@gmail.com';
        const subject = encodeURIComponent('Support Request');
        const body = encodeURIComponent('Hello,\n\nI need help with...');
        const mailtoURL = `mailto:${email}?subject=${subject}&body=${body}`;

        Linking.openURL(mailtoURL).catch(() => {
            Alert.alert('Error', 'Could not open email client.');
        });
    };

    const statusList = [
        { icon: 'log-in-outline', label: 'Sign In', onPress: handleSignIn },
        { icon: 'help-circle-outline', label: 'FAQ & Support', onPress: handleSupport },
        { icon: 'star-outline', label: 'Rate Us', onPress: handleRateUs },
        { icon: 'share-social-outline', label: 'Share App', onPress: handleShareApp },
        { icon: 'mail-outline', label: 'Contact Us', onPress: handleContactUs },
        { icon: 'archive-outline', label: 'Archived', onPress: handleArchive },
        { icon: 'trash-outline', label: 'Deleted', onPress: handleDelete },
        { icon: 'save-outline', label: 'Backup', onPress: handleBackup },
        { icon: 'shield-outline', label: 'Privacy Policy', onPress: handlePrivacyPolicy },
        { icon: 'cafe', label: 'Buy Me a Coffee', onPress: () => Linking.openURL('https://ko-fi.com/aiautoinvoicing'), },
    ];

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={s_global.Drawer_Container}>
            <View style={s_global.Drawer_Header}>
                <Image
                    source={require('@/assets/h.jpg')}
                    style={{ width: 200, height: 60, borderRadius: 32, }}
                    resizeMode="contain"
                />
                <TouchableOpacity onPress={async () => {
                    try {
                        const { signOut } = await import('firebase/auth');
                        const { auth } = await import('@/src/config/firebaseConfig');
                        await signOut(auth);
                        setFirebaseUser(null);
                    } catch (error) {
                        // Optionally handle error
                    }
                }}>
                    <Text className="text-white mt-2 text-base">
                        {auth.currentUser
                            ? (auth.currentUser.isAnonymous
                                ? "Guest User"
                                : auth.currentUser.email || "User")
                            : "User"}
                    </Text>
                </TouchableOpacity>
            </View>


            <View style={{ padding: 10, paddingTop: 10 }}>
                {statusList.map((item, index) => (
                    <React.Fragment key={index}>
                        {/* Divider before "Share App" */}
                        {(item.label === "Archived" || item.label === "Privacy Policy") && (
                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', marginVertical: 12 }} />
                        )}
                        <TouchableOpacity style={s_global.DrawerItem} onPress={item.onPress}>
                            <Ionicons name={item.icon as IoniconName} size={20} color="#888" style={{ marginRight: 8 }} />
                            <Text style={s_global.Text888}>{item.label}</Text>
                            <Ionicons name="chevron-forward-outline" size={18} color="#888" />
                        </TouchableOpacity>
                    </React.Fragment>
                ))}
            </View>

            <View style={s_global.DrawerFooter}>
                <TouchableOpacity
                    style={s_global.SettingsButton}
                    onPress={() => {
                        props.navigation.closeDrawer();
                        props.navigation.navigate('DetailStack', { screen: 'Drawer_Settings' });
                    }}
                >
                    <Ionicons name="settings-outline" size={20} color="#888" />
                    <Text style={s_global.Text888}>Settings</Text>
                    <Ionicons name="chevron-forward-outline" size={18} color="#888" style={{ marginRight: 4 }} />
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView >
    );
};

export default CustomDrawerContent;
