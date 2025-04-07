import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export const copyImageToPermanentLocation = async (uri: string): Promise<string> => {
  const fileName = uri.split('/').pop();
  const permanentDir = `${FileSystem.documentDirectory}images/`;
  const permanentPath = `${permanentDir}${fileName}`;

  // Create directory if it doesn't exist
  await FileSystem.makeDirectoryAsync(permanentDir, { intermediates: true });

  // Copy file to permanent location
  await FileSystem.copyAsync({
    from: uri,
    to: permanentPath
  });

  return permanentPath;
};
