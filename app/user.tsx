import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, usePathname } from 'expo-router'
import Header from '@/components/header'
import Profilee from '@/components/profilee'
import { supabase } from '@/utils/supabase'

type Props = {}

const User = (props: Props) => {
    const params = useLocalSearchParams();
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);

    const getUser = async () => {
        const { data, error } = await supabase
            .from('User')
            .select('*')
            .eq('id', params.user_id)
            .single()
        console.log(data);
        if (error) return console.error(error);

        setUser(data);
    }

    const getFollowing = async () => {
        console.log(params);
        const { data, error } = await supabase
            .from('Follower')
            .select('*')
            .eq('user_id', params.user_id)

        if (error) return console.error(error)
        setFollowing(data)
    }

    const getFollowers = async () => {
        const { data, error } = await supabase
            .from('Follower')
            .select('*')
            .eq('follower_user_id', params.user_id)

        if (error) return console.error(error)
        setFollowers(data)
    }

    useEffect(() => {
        getUser()
        getFollowing()
        getFollowers()
    }, [params.user_id])

    return (
        <SafeAreaView className='flex-1'>
            <Header title={`${user?.username}`} color="black" goBack search={false} />

            <Profilee
                user={user}
                followers={followers}
                following={following}
            />
        </SafeAreaView>
    )
}

export default User;