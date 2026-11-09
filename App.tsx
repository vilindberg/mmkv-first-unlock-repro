import { useState } from 'react'
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { createMMKV } from 'react-native-mmkv'

// One instance for the whole process, created at module load like most apps do
// (zustand/redux-persist adapters, auth token stores, ...).
const storage = createMMKV({ id: 'repro' })

function read() {
  return {
    counter: storage.getString('counter'),
    keys: storage.getAllKeys().length,
  }
}

export default function App() {
  const [state, setState] = useState(read)
  const [lastError, setLastError] = useState<string>('none')

  const increment = () => {
    try {
      const next = Number(storage.getString('counter') ?? 0) + 1
      storage.set('counter', String(next))
      setLastError('none')
    } catch (e) {
      setLastError(String(e))
    }
    setState(read())
  }

  const reload = () => {
    // trim() is the only public call that reaches MMKV::clearMemoryCache(),
    // which makes the next access re-open the file.
    storage.trim()
    setState(read())
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>react-native-mmkv first-unlock repro</Text>
      <View style={styles.row}>
        <Text style={styles.label}>getString('counter')</Text>
        <Text style={styles.value}>{String(state.counter)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>getAllKeys().length</Text>
        <Text style={styles.value}>{state.keys}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>last set() error</Text>
        <Text style={styles.value}>{lastError}</Text>
      </View>
      <Button title="set(counter + 1)" onPress={increment} />
      <Button title="read again" onPress={() => setState(read())} />
      <Button title="trim() then read" onPress={reload} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  row: { gap: 2 },
  label: { fontSize: 12, color: '#666' },
  value: { fontSize: 16, fontFamily: 'Menlo' },
})
