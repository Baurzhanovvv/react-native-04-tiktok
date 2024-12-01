import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/providers/AuthProvider';
import Messages from '@/components/messages';
import { ScrollView } from 'react-native';

type Props = {}

const Comment = (props: Props) => {
    const { user } = useAuth()
    const params = useLocalSearchParams();
    const [comments, setComments] = useState<any[]>([])

    useEffect(() => {
        getComments()
    }, [])

    const getComments = async () => {
        const { data, error } = await supabase
            .from('Comment')
            .select('*, User(*)')
            .eq('video_id', params.video_id)
        if (error) return console.error(error)
        setComments(data)
    }

    const addComments = async (text: string) => {
        const { error } = await supabase.from('Comment').insert({
            user_id: user.id,
            video_id: params.video_id,
            text: text,
            video_user_id: params.video_user_id
        })
        if (error) return console.error(error)
        getComments()
    }

    return <Messages messages={comments} addMessage={addComments} />
}

export default Comment