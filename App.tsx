import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import WebViewScreen from './WebViewScreen';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <WebViewScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
