import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getDashboardStats } from '../db/database';

const money = (value) => `${Number(value || 0).toFixed(2).replace('.', ',')} EUR`;

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({ clients: 0, factures: 0, attente: 0 });

  useFocusEffect(useCallback(() => {
    getDashboardStats().then(setStats).catch(() => {});
  }, []));

  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>GESTION LOCALE</Text>
      <Text style={styles.title}>Bonjour, QuickDevis</Text>
      <Text style={styles.subtitle}>Votre activité, simplement.</Text>
      <View style={styles.grid}>
        <View style={styles.card}><Text style={styles.label}>CLIENTS</Text><Text style={styles.value}>{stats.clients}</Text></View>
        <View style={styles.card}><Text style={styles.label}>FACTURE PAYÉE</Text><Text style={styles.value}>{money(stats.factures)}</Text></View>
        <View style={styles.cardWide}><Text style={styles.label}>EN ATTENTE DE PAIEMENT</Text><Text style={styles.value}>{money(stats.attente)}</Text></View>
      </View>
      <Text style={styles.sectionTitle}>Accès rapides</Text>
      <Pressable style={styles.action} onPress={() => navigation.navigate('Clients')}><Text style={styles.actionTitle}>Gérer les clients</Text><Text style={styles.actionArrow}>›</Text></Pressable>
      <Pressable style={styles.action} onPress={() => navigation.navigate('Products')}><Text style={styles.actionTitle}>Gérer les produits et services</Text><Text style={styles.actionArrow}>›</Text></Pressable>
      <Pressable style={styles.action} onPress={() => navigation.navigate('Documents')}><Text style={styles.actionTitle}>Créer un devis ou une facture</Text><Text style={styles.actionArrow}>›</Text></Pressable>
      <Pressable style={styles.action} onPress={() => navigation.navigate('Settings')}><Text style={styles.actionTitle}>Paramètres et sauvegarde</Text><Text style={styles.actionArrow}>›</Text></Pressable>
      <Pressable style={styles.action} onPress={() => navigation.navigate('History')}><Text style={styles.actionTitle}>Voir l’historique</Text><Text style={styles.actionArrow}>›</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F4EE', padding: 24 },
  eyebrow: { color: '#B45A3C', fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginTop: 18 },
  title: { color: '#202522', fontSize: 30, fontWeight: '800', marginTop: 10 },
  subtitle: { color: '#68716B', fontSize: 16, marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 28 },
  card: { backgroundColor: '#FFFFFF', borderColor: '#E6E0D6', borderWidth: 1, borderRadius: 8, padding: 18, width: '47%', minHeight: 112 },
  cardWide: { backgroundColor: '#203B35', borderRadius: 8, padding: 18, width: '100%', minHeight: 116 },
  label: { color: '#8A918B', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  value: { color: '#202522', fontSize: 24, fontWeight: '800', marginTop: 16 },
  sectionTitle: { color: '#202522', fontSize: 18, fontWeight: '800', marginTop: 34, marginBottom: 12 },
  action: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E6E0D6', borderWidth: 1, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, minHeight: 58, paddingHorizontal: 18 },
  actionTitle: { color: '#203B35', fontSize: 15, fontWeight: '700' },
  actionArrow: { color: '#B45A3C', fontSize: 28, lineHeight: 28 },
});
