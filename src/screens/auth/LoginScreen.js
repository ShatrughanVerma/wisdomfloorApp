import React, { useState } from 'react';
import { loginUser } from '../../services/api/authApi';
import { Alert } from 'react-native';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import api from '../../services/api/api';

const { width, height } = Dimensions.get('window');

// ---- Regex patterns ----
// Username: 3-20 characters, letters/numbers/underscores/dots only
const USERNAME_REGEX = /^[a-zA-Z0-9_.]{3,20}$/;
// Password: min 6 characters, at least one letter and one number
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Error state
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);

  const validateUsername = (value) => {
    if (!value) {
      setUsernameError('Username is required');
      return false;
    }
    if (!USERNAME_REGEX.test(value)) {
      setUsernameError(
        '3-20 characters: letters, numbers, "_" or "." only'
      );
      return false;
    }
    setUsernameError('');
    return true;
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    }
    if (!PASSWORD_REGEX.test(value)) {
      setPasswordError(
        'Min 6 characters, with at least one letter and one number'
      );
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleUsernameChange = (value) => {
    setUsername(value);
    if (usernameError) validateUsername(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (passwordError) validatePassword(value);
  };
const handleLogin = async () => {
  const isUsernameValid = validateUsername(username);
  const isPasswordValid = validatePassword(password);

  if (!isUsernameValid || !isPasswordValid) {
    return;
  }

  try {
    const response = await loginUser(username, password);

    console.log(
      'Login Success---------------------------------:',
      response
    );

    Alert.alert('Success', response.message);

    navigation.replace('HomeScreen');
  } catch (error) {
    console.log(error);

    if (error.response) {
      Alert.alert(
        'Login Failed',
        error.response.data.message || 'Invalid Username or Password'
      );
    } else {
      Alert.alert(
        'Error',
        'Unable to connect to server'
      );
    }
  }
};

  return (
    <ImageBackground
      source={require('../../assets/images/splash_bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>

            {/* Logo */}
            <View style={styles.logoWrap}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Heading */}
            <Text style={styles.heading}>Login to</Text>
            <Text style={styles.subHeading}>Wisdom Floor</Text>

            {/* Username */}
            <Text style={styles.label}>Username</Text>

            <TextInput
              style={[
                styles.input,
                usernameError ? styles.inputError : null,
              ]}
              placeholder="Enter username"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={handleUsernameChange}
              onBlur={() => validateUsername(username)}
              autoCapitalize="none"
            />
            {!!usernameError && (
              <Text style={styles.errorText}>{usernameError}</Text>
            )}

            {/* Password */}
            <Text style={[styles.label, { marginTop: 15 }]}>
              Password
            </Text>

            <TextInput
              style={[
                styles.input,
                passwordError ? styles.inputError : null,
              ]}
              placeholder="Enter password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => validatePassword(password)}
              autoCapitalize="none"
            />
            {!!passwordError && (
              <Text style={styles.errorText}>{passwordError}</Text>
            )}

            {/* Login */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>
                Login
              </Text>
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => setShowForgotModal(true)}
            >
              <Text style={styles.forgot}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        visible={showForgotModal}
        onCancel={() => setShowForgotModal(false)}
        onForgotPassword={() => {
          setShowForgotModal(false);

          navigation.navigate('ForgotPassword');
        }}
      />

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.06,
    paddingVertical: 30,
  },

  card: {
    width: '100%',
    padding: width * 0.05,
    borderRadius: 12,
  },

  logoWrap: {
    alignItems: 'center',
    marginBottom: height * 0.02,
  },

  logo: {
    width: width * 0.22,
    height: width * 0.22,
  },

  heading: {
    fontSize: width * 0.07,
    fontWeight: '700',
    color: '#fff',
  },

  subHeading: {
    fontSize: width * 0.065,
    color: '#3a9fd5',
    marginBottom: height * 0.03,
  },

  label: {
    color: '#ddd',
    marginBottom: 5,
    fontSize: width * 0.035,
  },

  input: {
    height: height * 0.06,
    borderWidth: 1,
    borderColor: '#c8deea',
    borderRadius: 11,
    paddingHorizontal: 12,
    color: '#fff',
    fontSize: width * 0.035,
  },

  inputError: {
    borderColor: '#e74c3c',
  },

  errorText: {
    color: '#e74c3c',
    fontSize: width * 0.03,
    marginTop: 4,
  },

  button: {
    height: height * 0.065,
    backgroundColor: '#3a9fd5',
    marginTop: 25,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: width * 0.04,
  },

  forgot: {
    textAlign: 'center',
    marginTop: 15,
    color: '#ccc',
    fontSize: width * 0.033,
  },
});