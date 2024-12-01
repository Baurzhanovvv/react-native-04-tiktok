import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { supabase } from '@/utils/supabase'

type Props = {}

const Inbox = (props: Props) => {
  const { followers, friends } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState([])

  const getUsers = async () => {
    const { data, error } = await supabase
      .from("User")
      .select("*")
      .in("id", friends)
    if (error) return console.log(error)
    setUsers(data)
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <SafeAreaView className='flex-1 items-center bg-white'>
      <Text className='text-black font-bold text-2xl text-center'>Inbox</Text>
      <TouchableOpacity
        onPress={() => router.push('/followers')}
        className='flex-row gap-2 items-center w-full m-1'
      >
        <View className='flex-row w-full justify-between items-center px-3'>
          <View className='flex-row gap-2'>
            <View className='w-12 h-12 rounded-full bg-blue-400 items-center justify-center'>
              <Ionicons name="people" size={30} color="white" />
            </View>
            <View>
              <Text className='font-bold text-base'>New Followers</Text>
              <Text>Say hi</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/activity')}
        className='flex-row gap-2 items-center w-full m-1'
      >
        <View className='flex-row w-full justify-between items-center px-3'>
          <View className='flex-row gap-2'>
            <View className='w-12 h-12 rounded-full bg-red-400 items-center justify-center'>
              <Ionicons name="time" size={30} color="white" />
            </View>
            <View>
              <Text className='font-bold text-base'>Activity</Text>
              <Text>See what people are doing</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </View>
      </TouchableOpacity>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/chat?chat_user_id=${item.id}`)}
            className='flex-row gap-2 items-center w-full m-1'
          >
            <View className='flex-row w-full justify-between items-center px-3'>
              <View className='flex-row gap-2'>
                <Image
                  source={{ uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${item?.id}/avatar.jpg` }}
                  className='w-12 h-12 rounded-full bg-black'
                />
                <View>
                  <Text className='font-bold text-base'>{item.username}</Text>
                  <Text>Say hi</Text>
                </View>
              </View>
              <Ionicons className='px-3' name="chevron-forward" size={20} color="black" />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}

export default Inbox

const styles = StyleSheet.create({})