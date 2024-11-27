import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useAuth } from '@/providers/AuthProvider'

type Props = {}

const Profile = (props: Props) => {
  const { signOut } = useAuth()
  return (
    <View className='flex-1 justify-center items-center bg-white'>
      <Text className='text-black font-bold text-2xl'>Profile</Text>

      <TouchableOpacity
        onPress={signOut}
        className='bg-black px-4 py-2 rounded-lg'
        >
        <Text className='text-white font-bold text-3xl'>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})