import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';

export const AuthContext = React.createContext({
    user: null,
    signIn: async (email: string, password: string) => { },
    signUp: async (username: string, email: string, password: string) => { },
    signOut: async () => { }
});

export const useAuth = () => React.useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);

    const router = useRouter()

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
        if(error) return console.error(error);
        setUser(null)
        router.push('/(auth)')
    }

    useEffect(() => {
        const { data: authData } = supabase.auth.onAuthStateChange((event, session) => {
            if(!session) return router.push("/(auth)")
            getUser(session?.user.id)
        })
        return () => {
            authData.subscription.unsubscribe()
        }
    }, [])

    return <AuthContext.Provider value={{ user, signIn, signOut, signUp }}>{children}</AuthContext.Provider>
}

