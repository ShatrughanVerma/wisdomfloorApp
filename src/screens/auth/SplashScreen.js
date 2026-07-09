import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    checkLoginStatus();
  }, );

  const checkLoginStatus = async () => {
    try {
      // Keep splash visible for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Get stored token
      const token = await AsyncStorage.getItem('token');

      console.log('Stored Token:', token);

      if (token) {
        // User already logged in
        navigation.replace('HomeScreen');
      } else {
        // User not logged in
        navigation.replace('LoginScreen');
      }
    } catch (error) {
      console.log('Splash Error:', error);

      navigation.replace('LoginScreen');
    }
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ImageBackground
        source={require('../../assets/images/splash_bg.png')}
        style={styles.container}
        resizeMode="cover">
        <View style={styles.overlay}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 240,
    height: 240,
  },
}); 