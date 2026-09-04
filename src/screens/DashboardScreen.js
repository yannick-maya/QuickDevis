import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen({ navigation }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}><Text style={styles.eyebrow}>GESTION LOCALE</Text><Text style={styles.title}>Votre activité, en un coup d’œil.</Text><Text style={styles.subtitle}>Créez, suivez et partagez vos devis depuis un seul espace.</Text><Pressable style={styles.heroButton} onPress={() => navigation.navigate('Documents')}><Text style={styles.heroButtonText}>Nouveau devis</Text><Text style={styles.heroArrow}>→</Text></Pressable></View>
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
  heroButton: { alignItems: 'center', backgroundColor: '#1677FF', borderColor: '#8DBAFF', borderRadius: 10, borderWidth: 1, elevation: 5, flexDirection: 'row', justifyContent: 'space-between', marginTop: 22, minHeight: 62, paddingHorizontal: 18, shadowColor: '#062F84', shadowOpacity: 0.3, shadowRadius: 8 },
  heroButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '900' },
  heroArrow: { color: '#FFFFFF', fontSize: 28, fontWeight: '300' },
  sectionTitle: { color: '#1459C7', fontSize: 19, fontWeight: '800', marginTop: 30, marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  action: { backgroundColor: '#FFFFFF', borderColor: '#D7E5FF', borderWidth: 1, borderRadius: 10, minHeight: 112, padding: 14, width: '48%' },
  actionIcon: { color: '#1677FF', fontSize: 22, fontWeight: '800', marginBottom: 16 },
  actionTitle: { color: '#1459C7', fontSize: 15, fontWeight: '700' },
  actionArrow: { color: '#1677FF', fontSize: 28, lineHeight: 28 },
});
