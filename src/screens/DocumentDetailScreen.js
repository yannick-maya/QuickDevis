import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { convertQuoteToInvoice, getDocument } from '../db/database';

const money = (value) => `${Number(value || 0).toFixed(2).replace('.', ',')} EUR`;

export default function DocumentDetailScreen({ route, navigation }) {
  const [document, setDocument] = useState(null);
  const load = useCallback(() => { getDocument(route.params.id).then(setDocument).catch(() => {}); }, [route.params.id]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function convert() {
    await convertQuoteToInvoice(document.id);
    Alert.alert('Facture créée', 'La facture a été créée à partir de ce devis.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  }

  if (!document) return <View style={styles.empty}><Text>Chargement du document...</Text></View>;
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}><Text style={styles.number}>{document.numero}</Text><Text style={styles.client}>{document.client_nom}</Text><Text style={styles.meta}>{document.type} · {document.statut}</Text>{document.lines.map((line) => <View style={styles.line} key={line.id}><Text style={styles.description}>{line.description}</Text><Text style={styles.detail}>{line.quantite} x {money(line.prix_unitaire)} = {money(line.total_ligne)}</Text></View>)}<Text style={styles.total}>Total : {money(document.total)}</Text>{document.type === 'devis' && <Pressable style={styles.button} onPress={convert}><Text style={styles.buttonText}>Convertir en facture</Text></Pressable>}</ScrollView>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#F7F4EE' }, content: { padding: 20 }, number: { color: '#203B35', fontSize: 28, fontWeight: '800' }, client: { color: '#202522', fontSize: 18, fontWeight: '700', marginTop: 8 }, meta: { color: '#7B847D', marginBottom: 24, marginTop: 5, textTransform: 'capitalize' }, line: { backgroundColor: '#FFFFFF', borderBottomColor: '#ECE7DE', borderBottomWidth: 1, padding: 14 }, description: { color: '#203B35', fontSize: 15, fontWeight: '800' }, detail: { color: '#7B847D', marginTop: 4 }, total: { color: '#203B35', fontSize: 22, fontWeight: '800', marginVertical: 22, textAlign: 'right' }, button: { alignItems: 'center', backgroundColor: '#B45A3C', borderRadius: 7, minHeight: 50, justifyContent: 'center' }, buttonText: { color: '#FFFFFF', fontWeight: '800' }, empty: { alignItems: 'center', backgroundColor: '#F7F4EE', flex: 1, justifyContent: 'center' } });
