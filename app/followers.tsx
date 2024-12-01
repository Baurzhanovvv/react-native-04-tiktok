import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import Header from '@/components/header'
import { Image } from 'react-native'

type Props = {}

const Followers = (props: Props) => {
    const { followers } = useAuth()
    const router = useRouter()
    return (
        <SafeAreaView className='flex-1 bg-white'>
            <Header title="Followers" goBack search={false} color="black" />
            <FlatList
                data={followers}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push(`/user?user_id=${item.user_id}`)}
                        className='flex-row gap-2 items-center w-full m-1'
                    >
                        <View className='flex-row w-full justify-between items-center px-3'>
                            <View className='flex-row gap-2'>
                                <Image
                                    source={{ uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${item.User.id}/avatar.jpg` }}
                                    className='w-12 h-12 rounded-full bg-black'
                                />
                                <View>
                                    <Text className='font-bold text-base'>{item.User.username}</Text>
                                    <Text>Say hi</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="black" />
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    )
}

export default Followers

const styles = StyleSheet.create({})