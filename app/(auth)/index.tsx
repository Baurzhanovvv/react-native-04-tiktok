import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/providers/AuthProvider'

type Props = {}

const Index = (props: Props) => {
    const router = useRouter()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { signIn } = useAuth()

    // const handleLogin = async () => {
    //     const { data, error } = await supabase.auth.signInWithPassword({
    //         email: email,
    //         password: password
    //     });
    //     if (error) return console.error(error);
    //     router.push('/(tabs)')
    // }

    return (
        <View className='flex-1 items-center justify-center bg-white'>
            <View className='w-full p-4'>
                <Text className='text-black font-bold text-3xl text-center mb-4'>Login</Text>
                <TextInput
                    placeholder='Email'
                    value={email}
                    autoCapitalize="none"
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
                    onPress={() => signIn(email, password)}
                >
                    <Text className='text-white font-bold text-center text-lg'>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push('/(auth)/signup')}
                >
                    <Text className='text-black font-semibold mt-3 text-center text-lg mb-4'>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({})