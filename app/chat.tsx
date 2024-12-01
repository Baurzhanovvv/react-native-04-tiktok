import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/providers/AuthProvider';
import Messages from '@/components/messages';

type Props = {}

const Chat = (props: Props) => {
    const { user } = useAuth()
    const params = useLocalSearchParams();
    const [message, setMessages] = useState<any[]>([])
    const users_key = [user.id, params.chat_user_id].sort().join(':')

    useEffect(() => {
        getMessages()
    }, [])

    useEffect(() => {
        const channel = supabase.channel(users_key).on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'Chat',
                filter: `users_key=eq.${users_key}`,
            },
            (payload) => {
                console.log("Realtime event received:", payload);
                getMessages();
            }
        ).subscribe();
        return () => {
            supabase.removeChannel(channel)
        }
    }, [message, setMessages, users_key])

    const getMessages = async () => {
        const { data, error } = await supabase
            .from('Chat')
            .select('*, User(*)')
            .eq('users_key', users_key)
        if (error) return console.error(error)
        setMessages(data)
    }

    const addMessage = async (text: string) => {
        const { error } = await supabase.from('Chat').insert({
            user_id: user.id,
            chat_user_id: params.chat_user_id,
            text: text,
            users_key: users_key
        })
        if (error) return console.error(error)
        getMessages()
    }

    return <Messages messages={message} addMessage={addMessage} />
}

export default Chat