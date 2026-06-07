import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { supabase } from './supabaseClient';

const TOP_BRANDS = [
  'Capital One', 'Chase', 'Uber', 'HelloFresh', 'Airbnb', 'Chime', 'Amex', 'Lyft', 'DoorDash'
];

export default function AddLinkScreen() {
  const [brandName, setBrandName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [referralUrl, setReferralUrl] = useState('');
  const [notes, setNotes] = useState('');

  // Auto-complete suggestions logic
  const filteredBrands = TOP_BRBrands.filter(b => b.toLowerCase().includes(brandName.toLowerCase()));

  const saveReferral = async () => {
    if (!brandName || !referralUrl) {
      Alert.alert('Error', 'Brand name and Referral URL are required.');
      return;
    }

    // Require website URL if it is a custom brand not in the seeded list
    if (!TOP_BRANDS.includes(brandName) && !websiteUrl) {
      Alert.alert('Error', 'Website URL is required for custom brands.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Insert new referral into Supabase
      const { error } = await supabase.from('referrals').insert({
        user_id: user.id,
        brand_name: brandName,
        website_url: websiteUrl,
        referral_url: referralUrl,
        notes
      });
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Referral added!');
        setBrandName('');
        setReferralUrl('');
        setWebsiteUrl('');
        setNotes('');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Brand Name (e.g., Uber)"
        value={brandName}
        onChangeText={setBrandName}
      />
      
      {brandName.length > 0 && filteredBrands.length > 0 && !TOP_BRANDS.includes(brandName) && (
        <View style={styles.autocomplete}>
           {filteredBrands.map(item => (
             <TouchableOpacity key={item} onPress={() => setBrandName(item)} style={styles.suggestionBox}>
               <Text>{item}</Text>
             </TouchableOpacity>
           ))}
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Website URL (optional unless custom brand)"
        value={websiteUrl}
        onChangeText={setWebsiteUrl}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Referral Link"
        value={referralUrl}
        onChangeText={setReferralUrl}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Notes (e.g., Get $20 off!)"
        value={notes}
        onChangeText={setNotes}
      />

      <Button title="Save Link" onPress={saveReferral} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 15 },
  autocomplete: { borderWidth: 1, borderColor: '#eee', backgroundColor: '#fff', marginBottom: 15, borderRadius: 5 },
  suggestionBox: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }
});
