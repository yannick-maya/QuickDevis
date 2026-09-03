import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { exportDatabaseData } from '../db/database';

export async function exportBackup() {
  const data = await exportDatabaseData();
  const uri = `${FileSystem.documentDirectory}quickdevis-${Date.now()}.json`;
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(data, null, 2));
  if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: 'application/json', dialogTitle: 'Sauvegarder QuickDevis' });
  return uri;
}
