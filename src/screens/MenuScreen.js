import { Pressable, StyleSheet, Text, View } from 'react-native';

const items = [
  ['Dashboard', 'Vue d’ensemble'],
  ['Documents', 'Devis & factures'],
  ['Clients', 'Clients'],
  ['Products', 'Produits & services'],
  ['History', 'Historique'],
  ['Settings', 'Paramètres et sauvegarde'],
  ['Guide', 'Guide d’utilisation'],
];

export default function MenuScreen({ navigation }) {
  return <View style={styles.screen}><Text style={styles.eyebrow}>QUICKDEVIS</Text><Text style={styles.title}>Menu principal</Text>{items.map(([route, label]) => <Pressable key={route} style={styles.item} onPress={() => navigation.navigate(route)}><Text style={styles.itemText}>{label}</Text><Text style={styles.arrow}>›</Text></Pressable>)}</View>;
}

const styles = StyleSheet.create({ screen: { backgroundColor: '#F7F4EE', flex: 1, padding: 24 }, eyebrow: { color: '#1677FF', fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginTop: 18 }, title: { color: '#1459C7', fontSize: 28, fontWeight: '800', marginBottom: 24, marginTop: 10 }, item: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#D7E5FF', borderRadius: 8, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, minHeight: 58, paddingHorizontal: 18 }, itemText: { color: '#1459C7', fontSize: 15, fontWeight: '700' }, arrow: { color: '#1677FF', fontSize: 28, lineHeight: 28 } });
