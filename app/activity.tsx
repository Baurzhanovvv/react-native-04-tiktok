import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Header from '@/components/header'
import { Image } from 'react-native'
import { supabase } from '@/utils/supabase'

type Props = {}

const Activity = (props: Props) => {
    const router = useRouter()
    const { user } = useAuth()
    const params = useLocalSearchParams();

    const [activity, setActivity] = useState([])

    useEffect(() => {
        getComments()
    }, [])

    const getComments = async () => {
        const { data, error } = await supabase
            .from('Comment')
            .select('*, User(*)')
            .eq('video_user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10)
        if (error) return console.log(error);
        getLikes(data)
    }
    const getLikes = async (comments: any) => {
        const { data, error } = await supabase
            .from('Like')
            .select('*, User(*)')
            .eq('video_user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10)
        if (error) return console.log(error);
        setActivity(comments.concat(data))
    }

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <Header title="Followers" goBack search={false} color="black" />
            <FlatList
                data={activity}
                renderItem={({ item }) => (
                    <View className='flex-row gap-2 m-2'>
                        <Image
                            source={{ uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${item.User.id}/avatar.jpg` }}
                            className='w-12 h-12 rounded-full bg-black'
                        />
                        <View>
                            <Text className='font-bold text-base'>{item.User.username}</Text>
                            <Text>{item.text ? item.text : "Liked your post"}</Text>
                            <Text className='text-gray-500 text-xs'>{item.created_at}</Text>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default Activity

const styles = StyleSheet.create({})