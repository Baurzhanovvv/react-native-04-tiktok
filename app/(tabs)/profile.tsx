import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { supabase } from '@/utils/supabase'
import Profilee from '@/components/profilee'

type Props = {}

const Profile = (props: Props) => {
  const { user, signOut, followers, following } = useAuth()

  const addProfilePicture = async () => {
    // const { data, error } = await supabase
    //   .storage
    //   .from('profile')
    //   .upload(user?.id, {
    //     cacheControl: '3600',
    //     upsert: false
    //   })
  }

  return <Profilee user={user} following={following} followers={followers} signOut={signOut} />
}

export default Profile

const styles = StyleSheet.create({})