import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { supabase } from './supabaseClient';

export default function FriendsScreen() {
  const [searchPhone, setSearchPhone] = useState('');
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch accepted friendships, joining to the profiles table to get the friend's name/phone
    const { data, error } = await supabase
      .from('friendships')
      .select('id, friend_id, profiles!friendships_friend_id_fkey(full_name, phone)')
      .eq('user_id', user.id);

    if (!error && data) {
      setFriends(data);
    } else if (error) {
       console.error("Error fetching friends", error);
    }
  };

  const addFriend = async () => {
    if (!searchPhone) return;

    // 1. Locate the friend's profile by their phone number
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', searchPhone)
      .single();

    if (profileError || !profileData) {
      Alert.alert('Not Found', 'No user found with that phone number.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    // 2. Insert the new friendship record
    if (user && profileData) {
      const { error } = await supabase.from('friendships').insert({
        user_id: user.id,
        friend_id: profileData.id,
        status: 'accepted' // Simplification for MVP (no formal accept flow)
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Friend added!');
        setSearchPhone('');
        fetchFriends(); // Refresh list
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.addSection}>
        <TextInput
          style={styles.input}
          placeholder="Enter friend's phone number"
          value={searchPhone}
          onChangeText={setSearchPhone}
          keyboardType="phone-pad"
        />
        <Button title="Add Friend" onPress={addFriend} />
      </View>

      <Text style={styles.title}>My Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.profiles?.full_name || item.profiles?.phone}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  addSection: { marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  card: { padding: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, marginBottom: 10, backgroundColor: '#fff' },
  name: { fontSize: 16 }
});
