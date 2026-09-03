import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import ClientsScreen from './src/screens/ClientsScreen';

const Stack = createNativeStackNavigator();

function DocumentsScreen() {
  return <View style={styles.placeholder}><Text style={styles.placeholderTitle}>Documents</Text><Text style={styles.placeholderText}>La gestion des devis et factures arrive dans la prochaine étape.</Text></View>;
}

export default function App() {
  return <NavigationContainer><StatusBar style="dark" /><Stack.Navigator screenOptions={{ headerTintColor: '#203B35', headerTitleStyle: { fontWeight: '800' }, headerStyle: { backgroundColor: '#F7F4EE' }, contentStyle: { backgroundColor: '#F7F4EE' } }}><Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'QuickDevis' }} /><Stack.Screen name="Clients" component={ClientsScreen} options={{ title: 'Clients' }} /><Stack.Screen name="Documents" component={DocumentsScreen} options={{ title: 'Devis & Factures' }} /></Stack.Navigator></NavigationContainer>;
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: '#F7F4EE',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  placeholderTitle: { color: '#203B35', fontSize: 26, fontWeight: '800' },
  placeholderText: { color: '#68716B', fontSize: 16, marginTop: 10, textAlign: 'center' },
});
