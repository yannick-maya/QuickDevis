import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { createDocument, listClients, listDocuments, listProducts } from '../db/database';
import { formatMoney } from '../utils/format';

export default function DocumentsScreen({ navigation }) {
  const [documents, setDocuments] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [type, setType] = useState('devis');
  const [clientId, setClientId] = useState(null);
  const [lineType, setLineType] = useState('produit');
  const [productId, setProductId] = useState(null);
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [lines, setLines] = useState([]);

  const refresh = useCallback(() => { Promise.all([listDocuments({ type: filterType, statut: filterStatus }), listClients(), listProducts()]).then(([nextDocuments, nextClients, nextProducts]) => { setDocuments(nextDocuments); setClients(nextClients); setProducts(nextProducts); }).catch(() => {}); }, [filterStatus, filterType]);
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  function chooseProduct(product) { setProductId(product.id); setDescription(product.nom); setPrice(String(product.prix_unitaire)); }

  function addLine() {
    const parsedQuantity = Number(quantity.replace(',', '.'));
    const parsedPrice = Number(price.replace(',', '.'));
    if (!description.trim() || !Number.isFinite(parsedQuantity) || parsedQuantity <= 0 || !Number.isFinite(parsedPrice) || parsedPrice < 0) { Alert.alert('Ligne incomplète', 'Renseignez une description, une quantité et un prix valide.'); return; }
    setLines([...lines, { produit_id: lineType === 'produit' ? productId : null, type_ligne: lineType, description: description.trim(), quantite: parsedQuantity, prix_unitaire: parsedPrice }]);
    setDescription(''); setPrice(''); setQuantity('1'); setProductId(null);
  }

  async function save() {
    if (!clientId || !lines.length) { Alert.alert('Document incomplet', 'Sélectionnez un client et ajoutez au moins une ligne.'); return; }
    const documentId = await createDocument({ type, clientId, lines });
    setLines([]); setClientId(null); refresh();
    navigation.navigate('DocumentDetail', { id: documentId, preview: true });
  }

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <Text style={styles.heading}>Nouveau document</Text>
    <View style={styles.segment}><Pressable style={[styles.segmentButton, type === 'devis' && styles.selected]} onPress={() => setType('devis')}><Text style={[styles.segmentText, type === 'devis' && styles.selectedText]}>Devis</Text></Pressable><Pressable style={[styles.segmentButton, type === 'facture' && styles.selected]} onPress={() => setType('facture')}><Text style={[styles.segmentText, type === 'facture' && styles.selectedText]}>Facture</Text></Pressable></View>
    <Text style={styles.label}>Client</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.choices}>{clients.map((client) => <Pressable key={client.id} onPress={() => setClientId(client.id)} style={[styles.choice, clientId === client.id && styles.choiceSelected]}><Text style={styles.choiceText}>{client.nom}</Text></Pressable>)}</ScrollView>
    <Text style={styles.label}>Type de ligne</Text>
    <View style={styles.segment}><Pressable style={[styles.segmentButton, lineType === 'produit' && styles.selected]} onPress={() => setLineType('produit')}><Text style={[styles.segmentText, lineType === 'produit' && styles.selectedText]}>Produit</Text></Pressable><Pressable style={[styles.segmentButton, lineType === 'libre' && styles.selected]} onPress={() => setLineType('libre')}><Text style={[styles.segmentText, lineType === 'libre' && styles.selectedText]}>Ligne libre</Text></Pressable><Pressable style={[styles.segmentButton, lineType === 'main_oeuvre' && styles.selected]} onPress={() => setLineType('main_oeuvre')}><Text style={[styles.segmentText, lineType === 'main_oeuvre' && styles.selectedText]}>Main d'œuvre</Text></Pressable></View>
    {lineType === 'produit' && <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.choices}>{products.map((product) => <Pressable key={product.id} onPress={() => chooseProduct(product)} style={[styles.choice, productId === product.id && styles.choiceSelected]}><Text style={styles.choiceText}>{product.nom}</Text></Pressable>)}</ScrollView>}
    <TextInput placeholder={lineType === 'main_oeuvre' ? 'Description de la main d’œuvre' : 'Description'} placeholderTextColor="#89918B" value={description} onChangeText={setDescription} style={styles.input} />
    <View style={styles.inline}><TextInput placeholder="Quantité" placeholderTextColor="#89918B" value={quantity} onChangeText={setQuantity} keyboardType="decimal-pad" style={[styles.input, styles.half]} /><TextInput placeholder="Prix unitaire" placeholderTextColor="#89918B" value={price} onChangeText={setPrice} keyboardType="decimal-pad" style={[styles.input, styles.half]} /></View>
    <Pressable style={styles.secondaryButton} onPress={addLine}><Text style={styles.secondaryText}>Ajouter la ligne</Text></Pressable>
    {lines.map((line, index) => <View style={styles.line} key={`${line.description}-${index}`}><Text style={styles.lineName}>{line.description}</Text><Text style={styles.lineDetail}>{line.quantite} x {formatMoney(line.prix_unitaire)} = {formatMoney(line.quantite * line.prix_unitaire)}</Text></View>)}
    <Text style={styles.total}>Total : {formatMoney(lines.reduce((sum, line) => sum + line.quantite * line.prix_unitaire, 0))}</Text>
    <Pressable style={styles.button} onPress={save}><Text style={styles.buttonText}>Enregistrer le {type}</Text></Pressable>
    <Text style={styles.heading}>Documents récents</Text>
    <View style={styles.segment}><Pressable style={[styles.segmentButton, !filterType && styles.selected]} onPress={() => setFilterType('')}><Text style={[styles.segmentText, !filterType && styles.selectedText]}>Tous</Text></Pressable><Pressable style={[styles.segmentButton, filterType === 'devis' && styles.selected]} onPress={() => setFilterType('devis')}><Text style={[styles.segmentText, filterType === 'devis' && styles.selectedText]}>Devis</Text></Pressable><Pressable style={[styles.segmentButton, filterType === 'facture' && styles.selected]} onPress={() => setFilterType('facture')}><Text style={[styles.segmentText, filterType === 'facture' && styles.selectedText]}>Factures</Text></Pressable></View>
    <View style={styles.segment}><Pressable style={[styles.segmentButton, !filterStatus && styles.selected]} onPress={() => setFilterStatus('')}><Text style={[styles.segmentText, !filterStatus && styles.selectedText]}>Tous statuts</Text></Pressable><Pressable style={[styles.segmentButton, filterStatus === 'payé' && styles.selected]} onPress={() => setFilterStatus('payé')}><Text style={[styles.segmentText, filterStatus === 'payé' && styles.selectedText]}>Payé</Text></Pressable><Pressable style={[styles.segmentButton, filterStatus === 'brouillon' && styles.selected]} onPress={() => setFilterStatus('brouillon')}><Text style={[styles.segmentText, filterStatus === 'brouillon' && styles.selectedText]}>Brouillon</Text></Pressable></View>
    <FlatList scrollEnabled={false} data={documents} keyExtractor={(item) => String(item.id)} ListEmptyComponent={<Text style={styles.empty}>Aucun document créé.</Text>} renderItem={({ item }) => <Pressable onPress={() => navigation.navigate('DocumentDetail', { id: item.id })} style={styles.line}><Text style={styles.lineName}>{item.numero} · {item.client_nom}</Text><Text style={styles.lineDetail}>{item.type} · {formatMoney(item.total)} · {item.statut}</Text></Pressable>} />
  </ScrollView>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#F7F4EE' }, content: { padding: 20, paddingBottom: 40 }, heading: { color: '#1459C7', fontSize: 22, fontWeight: '800', marginBottom: 14, marginTop: 8 }, label: { color: '#68716B', fontSize: 12, fontWeight: '800', marginBottom: 8, marginTop: 8, textTransform: 'uppercase' }, segment: { flexDirection: 'row', gap: 6, marginBottom: 12 }, segmentButton: { borderColor: '#D9D4CB', borderRadius: 7, borderWidth: 1, flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 }, selected: { backgroundColor: '#1677FF', borderColor: '#1677FF' }, selectedText: { color: '#FFFFFF' }, segmentText: { color: '#1459C7', fontSize: 12, fontWeight: '700', textAlign: 'center' }, choice: { backgroundColor: '#FFFFFF', borderColor: '#D9D4CB', borderRadius: 7, borderWidth: 1, marginRight: 8, padding: 11 }, choiceSelected: { backgroundColor: '#D7E5FF', borderColor: '#1677FF' }, choiceText: { color: '#1459C7', fontWeight: '700' }, choices: { marginBottom: 8 }, input: { backgroundColor: '#FFFFFF', borderColor: '#BFD3F7', borderRadius: 7, borderWidth: 1, color: '#202522', fontSize: 15, marginBottom: 10, minHeight: 48, paddingHorizontal: 14 }, inline: { flexDirection: 'row', gap: 10 }, half: { flex: 1 }, secondaryButton: { alignItems: 'center', borderColor: '#1677FF', borderRadius: 7, borderWidth: 1, minHeight: 46, justifyContent: 'center' }, secondaryText: { color: '#1677FF', fontWeight: '800' }, line: { backgroundColor: '#FFFFFF', borderBottomColor: '#DCE7F8', borderBottomWidth: 1, padding: 13 }, lineName: { color: '#1459C7', fontSize: 15, fontWeight: '800' }, lineDetail: { color: '#7B847D', marginTop: 4 }, total: { color: '#1459C7', fontSize: 20, fontWeight: '800', marginVertical: 18, textAlign: 'right' }, button: { alignItems: 'center', backgroundColor: '#1677FF', borderRadius: 7, minHeight: 50, justifyContent: 'center', marginBottom: 24 }, buttonText: { color: '#FFFFFF', fontWeight: '800' }, empty: { color: '#7B847D', paddingVertical: 12, textAlign: 'center' } });
