import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export default function FilterSelect({ label, value, options, onChange }) {
  const [visible, setVisible] = useState(false);
  const selected = options.find((option) => option.value === value) || options[0];

  return <>
    <Pressable style={styles.select} onPress={() => setVisible(true)} accessibilityRole="button" accessibilityLabel={`Filtrer par ${label}`}>
      <View><Text style={styles.label}>{label.toUpperCase()}</Text><Text style={styles.value}>{selected.label}</Text></View><Text style={styles.chevron}>⌄</Text>
    </Pressable>
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
      <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.sheetHeader}><Text style={styles.sheetTitle}>{label}</Text><Pressable onPress={() => setVisible(false)}><Text style={styles.close}>Fermer</Text></Pressable></View>
          {options.map((option) => <Pressable key={option.value || 'all'} style={styles.option} onPress={() => { onChange(option.value); setVisible(false); }}><Text style={styles.optionLabel}>{option.label}</Text><View style={[styles.checkbox, value === option.value && styles.checked]}>{value === option.value && <Text style={styles.check}>✓</Text>}</View></Pressable>)}
        </Pressable>
      </Pressable>
    </Modal>
  </>;
}

const styles = StyleSheet.create({ select: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#BFD3F7', borderRadius: 9, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 58, paddingHorizontal: 14 }, label: { color: '#7892B8', fontSize: 10, fontWeight: '800', letterSpacing: 1 }, value: { color: '#1459C7', fontSize: 15, fontWeight: '800', marginTop: 5 }, chevron: { color: '#1677FF', fontSize: 24 }, backdrop: { backgroundColor: 'rgba(11, 35, 70, 0.42)', flex: 1, justifyContent: 'flex-end' }, sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 22, paddingBottom: 34 }, sheetHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }, sheetTitle: { color: '#1459C7', fontSize: 20, fontWeight: '800' }, close: { color: '#1677FF', fontWeight: '800' }, option: { alignItems: 'center', borderBottomColor: '#E5EDF8', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 54 }, optionLabel: { color: '#284B78', fontSize: 15, fontWeight: '600' }, checkbox: { alignItems: 'center', borderColor: '#BFD3F7', borderRadius: 6, borderWidth: 2, height: 24, justifyContent: 'center', width: 24 }, checked: { backgroundColor: '#1677FF', borderColor: '#1677FF' }, check: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' } });
