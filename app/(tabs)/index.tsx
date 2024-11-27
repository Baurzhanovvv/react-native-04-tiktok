import { View, Text } from 'react-native';
import React from 'react'
import { useAuth } from '@/providers/AuthProvider';


export default function HomeScreen() {
  const {user} = useAuth()
  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Text className='text-black font-bold text-2xl'>
        Home
      </Text>
    </View>
  );
}
