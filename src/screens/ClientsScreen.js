import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { deleteClient, listClients, saveClient } from '../db/database';

export default function ClientsScreen() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const refresh = useCallback(() => { listClients(search).then(setClients).catch(() => {}); }, [search]);
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  async function addClient() {
    if (!name.trim()) return Alert.alert('Nom requis', 'Saisissez le nom du client.');
    await saveClient({ nom: name.trim(), telephone: phone.trim() });
    setName(''); setPhone(''); refresh();
  }

  function removeClient(client) {
    Alert.alert('Supprimer le client ?', client.nom, [{ text: 'Annuler', style: 'cancel' }, { text: 'Supprimer', style: 'destructive', onPress: async () => { await deleteClient(client.id); refresh(); } }]);
  }

  return (
    <View style={styles.screen}>
      <TextInput placeholder="Rechercher un client" placeholderTextColor="#89918B" value={search} onChangeText={setSearch} style={styles.input} />
      <View style={styles.form}>
        <TextInput placeholder="Nom du client" placeholderTextColor="#89918B" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Téléphone (optionnel)" placeholderTextColor="#89918B" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
        <Pressable style={styles.button} onPress={addClient}><Text style={styles.buttonText}>Ajouter le client</Text></Pressable>
      </View>
      <FlatList data={clients} keyExtractor={(item) => String(item.id)} ListEmptyComponent={<Text style={styles.empty}>Aucun client pour le moment.</Text>} renderItem={({ item }) => (
        <View style={styles.row}><View><Text style={styles.name}>{item.nom}</Text><Text style={styles.detail}>{item.telephone || 'Coordonnées à compléter'}</Text></View><Pressable accessibilityLabel={`Supprimer ${item.nom}`} onPress={() => removeClient(item)}><Text style={styles.delete}>Supprimer</Text></Pressable></View>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F4EE', padding: 20 },
  form: { backgroundColor: '#FFFFFF', borderColor: '#E6E0D6', borderRadius: 8, borderWidth: 1, marginBottom: 20, padding: 14 },
  input: { backgroundColor: '#FFFFFF', borderColor: '#D9D4CB', borderRadius: 7, borderWidth: 1, color: '#202522', fontSize: 15, marginBottom: 10, minHeight: 48, paddingHorizontal: 14 },
  button: { alignItems: 'center', backgroundColor: '#B45A3C', borderRadius: 7, minHeight: 48, justifyContent: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  row: { alignItems: 'center', backgroundColor: '#FFFFFF', borderBottomColor: '#ECE7DE', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 72, paddingHorizontal: 14 },
  name: { color: '#203B35', fontSize: 16, fontWeight: '800' },
  detail: { color: '#7B847D', marginTop: 4 },
  delete: { color: '#B45A3C', fontSize: 12, fontWeight: '700' },
  empty: { color: '#7B847D', padding: 20, textAlign: 'center' },
});
