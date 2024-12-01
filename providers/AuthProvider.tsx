import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';

export const AuthContext = React.createContext({
    user: null,
    signIn: async (email: string, password: string) => { },
    signUp: async (username: string, email: string, password: string) => { },
    signOut: async () => { },
    likes: [],
    getLikes: async (userId: string) => { },
    following: [],
    getFollowing: async (userId: string) => { },
    followers: [],
    getFollowers: async (userId: string) => { },
    friends: [],
    getFriends: () => { }
});

export const useAuth = () => React.useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [likes, setLikes] = useState<any>()
    const [followers, setFollowers] = useState<any[]>([]);
    const [following, setFollowing] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([])
    const router = useRouter()

    useEffect(() => {
        getFriends()
    }, [following, followers])

    const getFriends = async () => {
        const followingIds = following.map(f => f.follower_user_id);
        const followerIds = followers.map(f => f.user_id)
        const duplicates = followingIds.filter(id => followerIds.includes(id))
        setFriends(duplicates)
    }

    const getLikes = async (userId: string) => {
        if (!userId) return

        const { data, error } = await supabase.from("Like").select('*').eq('user_id', userId);
        setLikes(data)
    }

    const getFollowing = async (userId: string) => {
        if (!userId) return

        const { data, error } = await supabase.from('Follower').select('*').eq('user_id', userId)
        if (!error) setFollowing(data);
    }

    const getFollowers = async (userId: string) => {
        if (!userId) return

        const { data, error } = await supabase.from('Follower').select('*, User(*)').eq('follower_user_id', userId)
        if (!error) setFollowers(data);
    }

    const getUser = async (id: string) => {
        const { data, error } = await supabase.from('User').select('*').eq('id', id).single()
        if (error) return console.error(error);
        setUser(data);
        router.push('/(tabs)')
    }

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) return console.error(error);
        getUser(data.user.id)
    }

    const signUp = async (username: string, email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if (error) return console.error(error);

        const { error: userError } = await supabase.from('User').insert({
            id: data.user?.id,
            username: username,
            email: email
        })
        if (userError) return console.error(userError);
        getUser(data?.user.id)
        router.back()
        router.push('/(tabs)')
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) return console.error(error);
        setUser(null)
        router.push('/(auth)')
    }

    useEffect(() => {
        const { data: authData } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session) return router.push("/(auth)")
            getUser(session?.user.id)
            getLikes(session?.user.id)
            getFollowers(session?.user.id)
            getFollowing(session?.user.id)
        })
        return () => {
            authData.subscription.unsubscribe()
        }
    }, [])

    return <AuthContext.Provider value={{
        user,
        signIn,
        signOut,
        signUp,
        likes,
        getLikes,
        followers,
        following,
        getFollowing,
        getFollowers,
        friends,
        getFriends
    }}>{children}</AuthContext.Provider>
}

