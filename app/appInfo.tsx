import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { ArrowLeft, Instagram, Twitter, Twitch, Youtube } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AppInfo'>;

export default function AppInfoScreen({ navigation }: Props) {
  const socialLinks = [
    { 
      name: 'Instagram',
      url: 'https://www.instagram.com/mfonisoeko/',
      icon: <Instagram size={20} color="#E1306C" />
    },
    {
      name: 'Twitter/X',
      url: 'https://www.x.com/FerralFoxx',
      icon: <Twitter size={20} color="#1DA1F2" />
    },
    {
      name: 'Twitch',
      url: 'https://www.twitch.tv/logikfoxx',
      icon: <Twitch size={20} color="#9146FF" />
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@LogikFoxx',
      icon: <Youtube size={20} color="#FF0000" />
    }
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft size={24} color="#6366f1" />
      </TouchableOpacity>

      <Text style={styles.title}>App Information</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.text}>
          This app was created by Mfoniso Eko to help users organize and manage their notes efficiently.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Version</Text>
        <Text style={styles.text}>1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Creator</Text>
        <Text style={styles.creatorName}>Mfoniso Eko</Text>
        <Text style={styles.text}>Connect with me on:</Text>
        
        {socialLinks.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={styles.socialLink}
            onPress={() => Linking.openURL(link.url)}
          >
            {link.icon}
            <Text style={styles.socialText}>{link.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0f172a',
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#6366f1',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
  },
  creatorName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#0f172a',
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  socialText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#3b82f6',
  },
});
