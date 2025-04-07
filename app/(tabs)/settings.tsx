import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Switch } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Lock, HardDrive, MessageSquare, Info } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import localStorageService from '../../lib/localStorage';

export default function SettingsScreen() {
  const router = useRouter();
  const [biometricLock, setBiometricLock] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const checkBiometricAvailability = async () => {
      try {
        const [hasHardware, isEnrolled] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync()
        ]);
        
        if (!hasHardware || !isEnrolled) {
          Alert.alert(
            'Biometrics not available',
            'Your device does not support biometric authentication or no biometrics are enrolled'
          );
          return false;
        }

        const isEnabled = await localStorageService.isBiometricLockEnabled();
        setBiometricLock(isEnabled);
        return true;
      } catch (error) {
        console.error('Biometric check failed:', error);
        return false;
      }
    };

    checkBiometricAvailability();
  }, []);

  const handleBiometricLockToggle = async (value: boolean) => {
    try {
      if (value) {
        const { success } = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to enable biometric lock',
        });
        if (success) {
          await AsyncStorage.setItem('@biometricLockEnabled', 'true');
          setBiometricLock(true);
          Alert.alert('Biometric Lock Enabled', 'You will need to use your device\'s security method to access the app.');
        }
      } else {
        await AsyncStorage.removeItem('@biometricLockEnabled');
        setBiometricLock(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle biometric lock');
      setBiometricLock(!value); // Revert the toggle on error
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert('Error', 'Please enter your feedback before submitting');
      return;
    }

    try {
      const feedbacks = await localStorageService.getFeedbacks();
      feedbacks.push({
        text: feedback,
        date: new Date().toISOString()
      });
      await localStorageService.saveFeedbacks(feedbacks);
      
      setFeedback('');
      Alert.alert('Thank you', 'Your feedback has been submitted!');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback');
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all locally stored data. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await localStorageService.clearAll();
            Alert.alert('Success', 'Cache cleared successfully');
          }
        }
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
    },
    header: {
      padding: 16,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#0f172a',
    },
    section: {
      backgroundColor: 'white',
      marginTop: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginHorizontal: 16,
    },
    sectionTitle: {
      paddingVertical: 12,
      fontSize: 14,
      fontWeight: '500',
      color: '#64748b',
      textTransform: 'uppercase',
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingText: {
      marginLeft: 12,
      fontSize: 16,
      color: '#0f172a',
    },
    input: {
      backgroundColor: '#f1f5f9',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      fontSize: 16,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
      alignItems: 'center',
      backgroundColor: 'white',
    },
    version: {
      fontSize: 14,
      color: '#64748b',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Lock size={20} color="#64748b" />
            <Text style={styles.settingText}>Biometric Lock</Text>
          </View>
          <Switch
            value={biometricLock}
            onValueChange={handleBiometricLockToggle}
            trackColor={{ false: '#d1d5db', true: '#818cf8' }}
            thumbColor={biometricLock ? '#6366f1' : '#f3f4f6'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feedback</Text>
        <TextInput
          style={styles.input}
          placeholder="Your feedback..."
          value={feedback}
          onChangeText={setFeedback}
          placeholderTextColor="#94a3b8"
          multiline
        />
        <TouchableOpacity 
          style={[styles.settingItem, {justifyContent: 'center'}]}
          onPress={handleSubmitFeedback}
        >
          <View style={styles.settingLeft}>
            <MessageSquare size={20} color="#6366f1" />
            <Text style={[styles.settingText, {color: '#6366f1'}]}>Submit Feedback</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => router.push('/appInfo')}
        >
          <View style={styles.settingLeft}>
            <Info size={20} color="#64748b" />
            <Text style={styles.settingText}>App Information</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={handleClearCache}
        >
          <View style={styles.settingLeft}>
            <HardDrive size={20} color="#64748b" />
            <Text style={styles.settingText}>Clear Local Cache</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
}
