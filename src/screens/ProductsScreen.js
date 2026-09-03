import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { deleteProduct, listProducts, saveProduct } from '../db/database';
import { formatMoney } from '../utils/format';

export default function ProductsScreen() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('unité');
  const [editingId, setEditingId] = useState(null);

  const refresh = useCallback(() => { listProducts(search).then(setProducts).catch(() => {}); }, [search]);
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  async function submit() {
    const parsedPrice = Number(price.replace(',', '.'));
    if (!name.trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      Alert.alert('Informations incomplètes', 'Saisissez un nom et un prix valide.');
      return;
    }
    await saveProduct({ id: editingId, nom: name.trim(), prix_unitaire: parsedPrice, unite: unit.trim() || 'unité' });
    setName(''); setPrice(''); setUnit('unité'); setEditingId(null); refresh();
  }

  function edit(product) {
    setEditingId(product.id); setName(product.nom); setPrice(String(product.prix_unitaire)); setUnit(product.unite || 'unité');
  }

  function remove(product) {
    Alert.alert('Supprimer le produit ?', product.nom, [{ text: 'Annuler', style: 'cancel' }, { text: 'Supprimer', style: 'destructive', onPress: async () => { await deleteProduct(product.id); refresh(); } }]);
  }

  return <View style={styles.screen}>
    <TextInput placeholder="Rechercher un produit ou service" placeholderTextColor="#89918B" value={search} onChangeText={setSearch} style={styles.input} />
    <View style={styles.form}>
      <TextInput placeholder="Nom" placeholderTextColor="#89918B" value={name} onChangeText={setName} style={styles.input} />
      <View style={styles.inline}><TextInput placeholder="Prix unitaire" placeholderTextColor="#89918B" value={price} onChangeText={setPrice} keyboardType="decimal-pad" style={[styles.input, styles.half]} /><TextInput placeholder="Unité" placeholderTextColor="#89918B" value={unit} onChangeText={setUnit} style={[styles.input, styles.half]} /></View>
      <Pressable style={styles.button} onPress={submit}><Text style={styles.buttonText}>{editingId ? 'Modifier le produit' : 'Ajouter le produit'}</Text></Pressable>
    </View>
    <FlatList data={products} keyExtractor={(item) => String(item.id)} ListEmptyComponent={<Text style={styles.empty}>Aucun produit ou service.</Text>} renderItem={({ item }) => <View style={styles.row}><View><Text style={styles.name}>{item.nom}</Text><Text style={styles.detail}>{formatMoney(item.prix_unitaire)} / {item.unite}</Text></View><View style={styles.actions}><Pressable onPress={() => edit(item)}><Text style={styles.edit}>Modifier</Text></Pressable><Pressable onPress={() => remove(item)}><Text style={styles.delete}>Supprimer</Text></Pressable></View></View>} />
  </View>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#F7F4EE', padding: 20 }, form: { backgroundColor: '#FFFFFF', borderColor: '#E6E0D6', borderRadius: 8, borderWidth: 1, marginBottom: 20, padding: 14 }, input: { backgroundColor: '#FFFFFF', borderColor: '#D9D4CB', borderRadius: 7, borderWidth: 1, color: '#202522', fontSize: 15, marginBottom: 10, minHeight: 48, paddingHorizontal: 14 }, inline: { flexDirection: 'row', gap: 10 }, half: { flex: 1 }, button: { alignItems: 'center', backgroundColor: '#1677FF', borderRadius: 7, minHeight: 48, justifyContent: 'center' }, buttonText: { color: '#FFFFFF', fontWeight: '800' }, row: { alignItems: 'center', backgroundColor: '#FFFFFF', borderBottomColor: '#ECE7DE', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 72, paddingHorizontal: 14 }, name: { color: '#203B35', fontSize: 16, fontWeight: '800' }, detail: { color: '#7B847D', marginTop: 4 }, actions: { alignItems: 'flex-end', gap: 8 }, edit: { color: '#1677FF', fontSize: 12, fontWeight: '700' }, delete: { color: '#B45A3C', fontSize: 12, fontWeight: '700' }, empty: { color: '#7B847D', padding: 20, textAlign: 'center' } });
