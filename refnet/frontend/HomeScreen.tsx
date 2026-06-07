import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Clipboard, Alert } from 'react-native';
import { supabase } from './supabaseClient';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [referrals, setReferrals] = useState<any[]>([]);

  useEffect(() => {
    fetchReferrals();
  }, [searchQuery]);

  const fetchReferrals = async () => {
    // Queries all referrals visible to the user.
    // Thanks to RLS policies in Supabase, this automatically filters to the user's
    // own referrals and the referrals belonging to their accepted friends.
    let query = supabase.from('referrals').select(`
      id, brand_name, referral_url, notes, user_id,
      profiles!referrals_user_id_fkey(full_name)
    `);
    
    if (searchQuery) {
      query = query.ilike('brand_name', \`%\${searchQuery}%\`);
    }

    const { data, error } = await query;
    if (error) {
      console.error(error);
    } else {
      // Sort alphabetically by friend's name (the simplest default layout as requested)
      const sortedData = (data || []).sort((a, b) => {
        const nameA = a.profiles?.full_name || 'Me';
        const nameB = b.profiles?.full_name || 'Me';
        return nameA.localeCompare(nameB);
      });
      setReferrals(sortedData);
    }
  };

  const copyToClipboard = (url: string) => {
    Clipboard.setString(url);
    Alert.alert('Copied!', 'Referral link copied to clipboard.');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="What are you buying today?"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <FlatList
        data={referrals}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.brand}>{item.brand_name}</Text>
            <Text style={styles.friendName}>Shared by: {item.profiles?.full_name || 'Me'}</Text>
            {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={() => copyToClipboard(item.referral_url)}>
              <Text style={styles.buttonText}>Copy Link & Open</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  searchBar: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  card: { padding: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 10, backgroundColor: '#fff' },
  brand: { fontSize: 18, fontWeight: 'bold' },
  friendName: { fontSize: 14, color: '#555', marginVertical: 4 },
  notes: { fontSize: 14, color: '#333', fontStyle: 'italic', marginBottom: 8 },
  button: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
