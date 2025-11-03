import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// Hook to access the navigation object provided by React Navigation
import {useNavigation} from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

  // --- Core Function: Handles Login Success and Navigation ---
  const handleLoginSuccess = () => {
    // 1. In a real app, API call and state dispatch (Redux) would happen here.

    // 2. Navigate to the main application flow ('Dashboard' screen name
    //    defined in Routes.js)
    // 🔑 Use 'replace' to clear the stack, preventing the user from returning to Login.
    navigation.replace('Dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Login</Text>

      {/* This is a placeholder for your actual login form (inputs, etc.)
        The button below simulates hitting the final 'Log In' action.
      */}

      {/* --- Link to Sign Up --- */}
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('SignupScreen')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>

      {/* --- Link to Forgot Password --- */}
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('ForgotScreen')}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* --- Primary Log In Button --- */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleLoginSuccess}>
        <Text style={styles.primaryButtonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#333',
  },
  primaryButton: {
    marginTop: 40,
    paddingVertical: 15,
    paddingHorizontal: 50,
    width: '80%',
    backgroundColor: '#ED8A00', // Your primary color
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  linkButton: {
    marginTop: 15,
  },
  linkText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
