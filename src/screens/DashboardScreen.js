import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getDashboardStats } from '../db/database';
import { formatMoney } from '../utils/format';

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({ clients: 0, factures: 0, attente: 0 });

  useFocusEffect(useCallback(() => {
    getDashboardStats().then(setStats).catch(() => {});
  }, []));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}><Text style={styles.eyebrow}>GESTION LOCALE</Text><Text style={styles.title}>Votre activité, en un coup d’œil.</Text><Text style={styles.subtitle}>Créez, suivez et partagez vos devis depuis un seul espace.</Text><Pressable style={styles.heroButton} onPress={() => navigation.navigate('Documents')}><Text style={styles.heroButtonText}>Nouveau devis</Text><Text style={styles.heroArrow}>→</Text></Pressable></View>
      <View style={styles.grid}>
        <View style={styles.card}><Text style={styles.label}>CLIENTS</Text><Text style={styles.value}>{stats.clients}</Text></View>
        <View style={styles.card}><Text style={styles.label}>FACTURE PAYÉE</Text><Text style={styles.value}>{formatMoney(stats.factures)}</Text></View>
        <View style={styles.cardWide}><Text style={styles.cardWideLabel}>EN ATTENTE DE PAIEMENT</Text><Text style={styles.cardWideValue}>{formatMoney(stats.attente)}</Text></View>
      </View>
      <Text style={styles.sectionTitle}>Accès rapides</Text><View style={styles.actionsGrid}><Pressable style={styles.action} onPress={() => navigation.navigate('Clients')}><Text style={styles.actionIcon}>◎</Text><Text style={styles.actionTitle}>Clients</Text><Text style={styles.actionArrow}>›</Text></Pressable><Pressable style={styles.action} onPress={() => navigation.navigate('Products')}><Text style={styles.actionIcon}>▦</Text><Text style={styles.actionTitle}>Produits</Text><Text style={styles.actionArrow}>›</Text></Pressable><Pressable style={styles.action} onPress={() => navigation.navigate('History')}><Text style={styles.actionIcon}>◷</Text><Text style={styles.actionTitle}>Historique</Text><Text style={styles.actionArrow}>›</Text></Pressable><Pressable style={styles.action} onPress={() => navigation.navigate('Settings')}><Text style={styles.actionIcon}>⚙</Text><Text style={styles.actionTitle}>Paramètres</Text><Text style={styles.actionArrow}>›</Text></Pressable></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F4EE' },
  content: { padding: 24, paddingBottom: 40 },
  hero: { backgroundColor: '#1459C7', borderRadius: 16, marginTop: 8, padding: 22 },
  eyebrow: { color: '#A9C9FF', fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', lineHeight: 34, marginTop: 10 },
  subtitle: { color: '#D7E5FF', fontSize: 15, lineHeight: 21, marginTop: 8 },
  heroButton: { alignItems: 'center', backgroundColor: '#1677FF', borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', marginTop: 22, minHeight: 48, paddingHorizontal: 16 },
  heroButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  heroArrow: { color: '#FFFFFF', fontSize: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 28 },
  card: { backgroundColor: '#FFFFFF', borderColor: '#E6E0D6', borderWidth: 1, borderRadius: 8, padding: 18, width: '47%', minHeight: 112 },
  cardWide: { backgroundColor: '#1677FF', borderRadius: 8, padding: 18, width: '100%', minHeight: 116 },
  label: { color: '#8A918B', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  value: { color: '#1459C7', fontSize: 24, fontWeight: '800', marginTop: 16 },
  cardWideLabel: { color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  cardWideValue: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginTop: 16 },
  sectionTitle: { color: '#1459C7', fontSize: 19, fontWeight: '800', marginTop: 30, marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  action: { backgroundColor: '#FFFFFF', borderColor: '#D7E5FF', borderWidth: 1, borderRadius: 10, minHeight: 112, padding: 14, width: '48%' },
  actionIcon: { color: '#1677FF', fontSize: 22, fontWeight: '800', marginBottom: 16 },
  actionTitle: { color: '#1459C7', fontSize: 15, fontWeight: '700' },
  actionArrow: { color: '#1677FF', fontSize: 28, lineHeight: 28 },
});
