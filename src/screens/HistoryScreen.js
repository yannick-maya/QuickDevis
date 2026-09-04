import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { listDocuments } from '../db/database';
import { formatMoney } from '../utils/format';
import FilterSelect from '../components/FilterSelect';
const date = (value) => value ? new Date(value).toLocaleDateString('fr-FR') : '';

export default function HistoryScreen({ navigation }) {
  const [documents, setDocuments] = useState([]);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const refresh = useCallback(() => { listDocuments({ type, statut: status }).then(setDocuments).catch(() => {}); }, [status, type]);
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));
  return <View style={styles.screen}><Text style={styles.heading}>Historique global</Text><Text style={styles.helper}>Affinez l’affichage avec les sélecteurs.</Text><View style={styles.filters}><FilterSelect label="Type" value={type} onChange={setType} options={[{ label: 'Tous les documents', value: '' }, { label: 'Devis uniquement', value: 'devis' }, { label: 'Factures uniquement', value: 'facture' }]} /><FilterSelect label="Statut" value={status} onChange={setStatus} options={[{ label: 'Tous les statuts', value: '' }, { label: 'Brouillons', value: 'brouillon' }, { label: 'Payés', value: 'payé' }, { label: 'Annulés', value: 'annulé' }]} /></View><FlatList data={documents} keyExtractor={(item) => String(item.id)} ListEmptyComponent={<Text style={styles.empty}>Aucun événement à afficher.</Text>} renderItem={({ item }) => <Pressable style={styles.row} onPress={() => navigation.navigate('DocumentDetail', { id: item.id })}><View><Text style={styles.number}>{item.numero}</Text><Text style={styles.detail}>{item.client_nom || 'Sans client'} · {date(item.date_creation)}</Text></View><View><Text style={styles.total}>{formatMoney(item.total)}</Text><Text style={styles.detail}>{item.type} · {item.statut}</Text></View></Pressable>} /></View>;
}

const styles = StyleSheet.create({ screen: { backgroundColor: '#F5F8FC', flex: 1, padding: 20 }, heading: { color: '#1459C7', fontSize: 26, fontWeight: '800', marginBottom: 6 }, helper: { color: '#607A9F', fontSize: 13, marginBottom: 16 }, filters: { gap: 10, marginBottom: 18 }, row: { alignItems: 'center', backgroundColor: '#FFFFFF', borderBottomColor: '#DDE7F5', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 74, paddingHorizontal: 14 }, number: { color: '#1459C7', fontSize: 15, fontWeight: '800' }, detail: { color: '#7B847D', fontSize: 12, marginTop: 4, textTransform: 'capitalize' }, total: { color: '#1677FF', fontWeight: '800', textAlign: 'right' }, empty: { color: '#7B847D', padding: 20, textAlign: 'center' } });
