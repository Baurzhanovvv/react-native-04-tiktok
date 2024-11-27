import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const router = useRouter()
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        headerShown: false,
        tabBarStyle: {
          height: 80,
          position: 'relative',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            focused ? <Ionicons name="home-sharp" size={24} color="black" /> : <Ionicons name="home-outline" size={24} color="black" />
          ),
        }}
      />

      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ focused }) => (
            focused ? <Ionicons name="people" size={24} color="black" /> : <Ionicons name="people-outline" size={24} color="black" />
          ),
        }}
      />

      <Tabs.Screen
        name="empty"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                position: 'absolute',
                bottom: -25,
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: 40,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
              }}
            >
              <Ionicons name="add-circle" size={75} color="black" />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/camera')
          }
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ focused }) => (
            focused ?
              <Ionicons name="chatbox-ellipses" size={24} color="black" />
              :
              <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            focused ? <Ionicons name="person" size={24} color="black" /> : <Ionicons name="person-outline" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
