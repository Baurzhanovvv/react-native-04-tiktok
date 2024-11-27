import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/providers/AuthProvider'


type Props = {}

const Signup = (props: Props) => {
  const router = useRouter()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("")

  const { signUp } = useAuth()

  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <View className='w-full p-4'>
        <Text className='text-black font-bold text-3xl text-center mb-4'>Sign up</Text>
        <TextInput
          placeholder='Username'
          value={username}
          autoCapitalize="none"
          onChangeText={setUsername}
          className='bg-white p-4 rounded-lg border border-gray-300 w-full mb-4'
        />
        <TextInput
          placeholder='Email'
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          className='bg-white p-4 rounded-lg border border-gray-300 w-full mb-4'
        />
        <TextInput
          secureTextEntry={true}
          autoCapitalize="none"
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          className='bg-white p-4 rounded-lg border border-gray-300 w-full mb-4'
        />
        <TouchableOpacity
          className='bg-black px-4 py-2 rounded-lg'
          onPress={() => signUp(username, email, password)}
        >
          <Text className='text-white font-bold text-center text-lg'>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/(auth)')}
        >
          <Text className='text-black font-semibold mt-3 text-center text-lg mb-4'>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Signup

const styles = StyleSheet.create({})