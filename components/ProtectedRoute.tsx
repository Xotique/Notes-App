import { useAuth } from '../context/AuthContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/auth/sign-in" />;
  }

  return <>{children}</>;
}
