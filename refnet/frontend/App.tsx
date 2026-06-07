import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';

import AuthScreen from './AuthScreen';
import HomeScreen from './HomeScreen';
import AddLinkScreen from './AddLinkScreen';
import FriendsScreen from './FriendsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Simple Auth Gate
  if (!session) {
    return <AuthScreen />;
  }

  // Main App Navigation
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'RefNet' }} />
        <Tab.Screen name="Add Link" component={AddLinkScreen} />
        <Tab.Screen name="Friends" component={FriendsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
