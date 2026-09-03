import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, InteractionManager, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { convertQuoteToInvoice, getDocument, updateDocumentStatus } from '../db/database';
import { createDocumentPdf, previewDocumentPdf, shareDocumentPdf } from '../utils/pdf';
import { formatMoney } from '../utils/format';

export default function DocumentDetailScreen({ route, navigation }) {
  const [document, setDocument] = useState(null);
  const previewStarted = useRef(false);
  const load = useCallback(() => { getDocument(route.params.id).then(setDocument).catch(() => {}); }, [route.params.id]);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  useEffect(() => {
    if (document && route.params?.preview && !previewStarted.current) {
      previewStarted.current = true;
      InteractionManager.runAfterInteractions(() => {
        previewDocumentPdf(document).catch(() => Alert.alert('Aperçu indisponible', 'L’aperçu PDF est disponible sur Android/iOS, pas dans Expo Web.'));
      });
      navigation.setParams({ preview: false });
    }
  }, [document, navigation, route.params?.preview]);

  async function convert() {
    try { await convertQuoteToInvoice(document.id); Alert.alert('Facture créée', 'La facture a été créée à partir de ce devis.', [{ text: 'OK', onPress: () => navigation.goBack() }]); } catch { Alert.alert('Erreur', 'Impossible de convertir ce devis en facture.'); }
  }

  async function generatePdf() {
    try { await createDocumentPdf(document); Alert.alert('PDF généré', 'Le PDF a été créé dans le stockage temporaire de l’appareil.'); } catch { Alert.alert('Erreur', 'Impossible de générer le PDF.'); }
  }

  async function sharePdf() {
    try { await shareDocumentPdf(document); } catch { Alert.alert('Erreur', 'Impossible de partager le PDF.'); }
  }

  async function changeStatus(status) {
    try { await updateDocumentStatus(document.id, status); setDocument({ ...document, statut: status }); } catch { Alert.alert('Erreur', 'Impossible de modifier le statut du document.'); }
  }

  if (!document) return <View style={styles.empty}><Text>Chargement du document...</Text></View>;
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}><Text style={styles.number}>{document.numero}</Text><Text style={styles.client}>{document.client_nom}</Text><Text style={styles.meta}>Statut : {document.statut}</Text>{document.lines.map((line) => <View style={styles.line} key={line.id}><Text style={styles.description}>{line.description}</Text><Text style={styles.detail}>{line.quantite} x {formatMoney(line.prix_unitaire)} = {formatMoney(line.total_ligne)}</Text></View>)}<Text style={styles.total}>Total : {formatMoney(document.total)}</Text><Pressable style={styles.secondaryButton} onPress={generatePdf}><Text style={styles.secondaryText}>Aperçu / générer le PDF</Text></Pressable><Pressable style={styles.secondaryButton} onPress={sharePdf}><Text style={styles.secondaryText}>Partager le PDF</Text></Pressable><View style={styles.statusActions}><Pressable style={styles.statusButton} onPress={() => changeStatus('brouillon')}><Text style={styles.statusText}>Brouillon</Text></Pressable><Pressable style={styles.statusButton} onPress={() => changeStatus('envoyé')}><Text style={styles.statusText}>Envoyé</Text></Pressable><Pressable style={styles.statusButton} onPress={() => changeStatus('payé')}><Text style={styles.statusText}>Payé</Text></Pressable></View>{document.type === 'devis' && <Pressable style={styles.button} onPress={convert}><Text style={styles.buttonText}>Convertir en facture</Text></Pressable>}</ScrollView>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#F7F4EE' }, content: { padding: 20 }, number: { color: '#1459C7', fontSize: 28, fontWeight: '800' }, client: { color: '#1459C7', fontSize: 18, fontWeight: '700', marginTop: 8 }, meta: { color: '#7B847D', marginBottom: 24, marginTop: 5, textTransform: 'capitalize' }, line: { backgroundColor: '#FFFFFF', borderBottomColor: '#ECE7DE', borderBottomWidth: 1, padding: 14 }, description: { color: '#1459C7', fontSize: 15, fontWeight: '800' }, detail: { color: '#7B847D', marginTop: 4 }, total: { color: '#1459C7', fontSize: 22, fontWeight: '800', marginVertical: 22, textAlign: 'right' }, secondaryButton: { alignItems: 'center', borderColor: '#1677FF', borderRadius: 7, borderWidth: 1, minHeight: 48, justifyContent: 'center', marginBottom: 10 }, secondaryText: { color: '#1677FF', fontWeight: '800' }, statusActions: { flexDirection: 'row', gap: 6, marginBottom: 14 }, statusButton: { alignItems: 'center', backgroundColor: '#1677FF', borderRadius: 7, flex: 1, justifyContent: 'center', minHeight: 42 }, statusText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' }, button: { alignItems: 'center', backgroundColor: '#1677FF', borderRadius: 7, minHeight: 50, justifyContent: 'center' }, buttonText: { color: '#FFFFFF', fontWeight: '800' }, empty: { alignItems: 'center', backgroundColor: '#F7F4EE', flex: 1, justifyContent: 'center' } });
