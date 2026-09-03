import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { getCompany, saveCompany } from '../db/database';
import { exportBackup } from '../utils/backup';

export default function SettingsScreen() {
  const [company, setCompany] = useState({ nom: '', adresse: '', telephone: '', email: '' });
  useFocusEffect(useCallback(() => { getCompany().then((saved) => { if (saved) setCompany(saved); }).catch(() => {}); }, []));
  const update = (field, value) => setCompany((current) => ({ ...current, [field]: value }));
  async function save() { await saveCompany(company); Alert.alert('Paramètres enregistrés', 'Ces informations seront utilisées dans les PDF.'); }
  async function backup() { try { await exportBackup(); } catch { Alert.alert('Erreur', 'Impossible de créer la sauvegarde.'); } }
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}><Text style={styles.heading}>Entreprise</Text><TextInput style={styles.input} placeholder="Nom de l’entreprise" placeholderTextColor="#89918B" value={company.nom} onChangeText={(value) => update('nom', value)} /><TextInput style={styles.input} placeholder="Adresse" placeholderTextColor="#89918B" value={company.adresse} onChangeText={(value) => update('adresse', value)} /><TextInput style={styles.input} placeholder="Téléphone" placeholderTextColor="#89918B" value={company.telephone} onChangeText={(value) => update('telephone', value)} keyboardType="phone-pad" /><TextInput style={styles.input} placeholder="Email" placeholderTextColor="#89918B" value={company.email} onChangeText={(value) => update('email', value)} keyboardType="email-address" autoCapitalize="none" /><Pressable style={styles.button} onPress={save}><Text style={styles.buttonText}>Enregistrer les informations</Text></Pressable><Text style={styles.heading}>Données locales</Text><Text style={styles.description}>Exportez une copie JSON de vos clients, produits et documents.</Text><Pressable style={styles.secondaryButton} onPress={backup}><Text style={styles.secondaryText}>Exporter une sauvegarde</Text></Pressable></ScrollView>;
}

const styles = StyleSheet.create({ screen: { backgroundColor: '#F7F4EE', flex: 1 }, content: { padding: 20 }, heading: { color: '#203B35', fontSize: 22, fontWeight: '800', marginBottom: 14, marginTop: 10 }, input: { backgroundColor: '#FFFFFF', borderColor: '#D9D4CB', borderRadius: 7, borderWidth: 1, color: '#202522', fontSize: 15, marginBottom: 10, minHeight: 48, paddingHorizontal: 14 }, button: { alignItems: 'center', backgroundColor: '#B45A3C', borderRadius: 7, justifyContent: 'center', minHeight: 50 }, buttonText: { color: '#FFFFFF', fontWeight: '800' }, description: { color: '#68716B', lineHeight: 22, marginBottom: 14 }, secondaryButton: { alignItems: 'center', borderColor: '#B45A3C', borderRadius: 7, borderWidth: 1, justifyContent: 'center', minHeight: 50 }, secondaryText: { color: '#B45A3C', fontWeight: '800' } });
