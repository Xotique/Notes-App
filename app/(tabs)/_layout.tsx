import { Tabs } from 'expo-router';
import { Chrome as Home, FolderOpen, Settings } from 'lucide-react-native';
import { Platform, StatusBar } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          height: Platform.OS === 'android' ? 60 : 10,
          paddingBottom: Platform.OS === 'android' ? 10 : 0,
        },
        tabBarActiveTintColor: '#6366f1',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => <FolderOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}