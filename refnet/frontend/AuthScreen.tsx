import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from './supabaseClient';

export default function AuthScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [token, setToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Trigger Supabase Phone OTP Request
  const requestOTP = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });
    
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setIsVerifying(true);
      Alert.alert('Success', 'OTP sent to your phone.');
    }
  };

  // Verify the OTP Token
  const verifyOTP = async () => {
    const { error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token,
      type: 'sms',
    });
    
    if (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to RefNet</Text>
      {!isVerifying ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Phone Number (e.g., +1234567890)"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
          <Button title="Send OTP" onPress={requestOTP} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit Code"
            value={token}
            onChangeText={setToken}
            keyboardType="number-pad"
          />
          <Button title="Verify Code" onPress={verifyOTP} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});
