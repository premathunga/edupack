import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const WebViewScreen: React.FC = () => {
  const [offlineUrl, setOfflineUrl] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineModalVisible, setOfflineModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadOfflineData = async () => {
      try {
        const data = await AsyncStorage.getItem('offlineUrl');
        if (data) {
          setOfflineUrl(data);
        }
      } catch (error) {
        console.error('Error loading offline data:', error);
      }
    };

    loadOfflineData();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
      if (!state.isConnected) {
        setOfflineModalVisible(true);
      } else {
        setOfflineModalVisible(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleWebViewLoad = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
  
    if (!nativeEvent.loading) {
      AsyncStorage.setItem('offlineUrl', nativeEvent.url);
  
      // Set loading to false after three seconds
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };
  

  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={offlineModalVisible}
        onRequestClose={() => {
          // Handle modal close if needed
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>You are currently offline.</Text>
            <TouchableOpacity
              onPress={() => {
                setOfflineModalVisible(false);
              }}
            >
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}

      <WebView
        source={{ uri: offlineUrl || 'https://edupack.lk/' }}
        onLoad={handleWebViewLoad}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'black',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 18,
      marginBottom: 10,
    },
    closeButton: {
      color: 'blue',
      fontSize: 16,
      marginTop: 10,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black', // Set a background color for full-screen loading
    },
  });
  
  export default WebViewScreen;
