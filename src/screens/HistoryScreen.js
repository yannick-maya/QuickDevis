import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { listDocuments } from '../db/database';
import { formatMoney } from '../utils/format';
const date = (value) => value ? new Date(value).toLocaleDateString('fr-FR') : '';

export default function HistoryScreen({ navigation }) {
  const [documents, setDocuments] = useState([]);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const refresh = useCallback(() => { listDocuments({ type, statut: status }).then(setDocuments).catch(() => {}); }, [status, type]);
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));
  return <View style={styles.screen}><Text style={styles.heading}>Historique global</Text><View style={styles.segment}>{['', 'devis', 'facture'].map((value) => <Pressable key={value || 'tous'} onPress={() => setType(value)} style={[styles.filter, type === value && styles.selected]}><Text style={styles.filterText}>{value || 'Tous'}</Text></Pressable>)}</View><View style={styles.segment}>{['', 'brouillon', 'payé', 'annulé'].map((value) => <Pressable key={value || 'tous-statuts'} onPress={() => setStatus(value)} style={[styles.filter, status === value && styles.selected]}><Text style={styles.filterText}>{value || 'Statuts'}</Text></Pressable>)}</View><FlatList data={documents} keyExtractor={(item) => String(item.id)} ListEmptyComponent={<Text style={styles.empty}>Aucun événement à afficher.</Text>} renderItem={({ item }) => <Pressable style={styles.row} onPress={() => navigation.navigate('DocumentDetail', { id: item.id })}><View><Text style={styles.number}>{item.numero}</Text><Text style={styles.detail}>{item.client_nom} · {date(item.date_creation)}</Text></View><View><Text style={styles.total}>{formatMoney(item.total)}</Text><Text style={styles.detail}>{item.type} · {item.statut}</Text></View></Pressable>} /></View>;
}

const styles = StyleSheet.create({ screen: { backgroundColor: '#F7F4EE', flex: 1, padding: 20 }, heading: { color: '#203B35', fontSize: 24, fontWeight: '800', marginBottom: 16 }, segment: { flexDirection: 'row', gap: 6, marginBottom: 8 }, filter: { alignItems: 'center', borderColor: '#D9D4CB', borderRadius: 7, borderWidth: 1, flex: 1, minHeight: 38, justifyContent: 'center' }, selected: { backgroundColor: '#203B35', borderColor: '#203B35' }, filterText: { color: '#203B35', fontSize: 12, fontWeight: '700', textTransform: 'capitalize' }, row: { alignItems: 'center', backgroundColor: '#FFFFFF', borderBottomColor: '#ECE7DE', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 74, paddingHorizontal: 14 }, number: { color: '#203B35', fontSize: 15, fontWeight: '800' }, detail: { color: '#7B847D', fontSize: 12, marginTop: 4, textTransform: 'capitalize' }, total: { color: '#B45A3C', fontWeight: '800', textAlign: 'right' }, empty: { color: '#7B847D', padding: 20, textAlign: 'center' } });
