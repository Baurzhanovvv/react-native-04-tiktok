import { View, Text, TextInput, TouchableOpacity, FlatList, Image, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    messages: any[],
    addMessage: (message: any) => void
}

const Messages = ({ messages, addMessage }: Props) => {
    const { user } = useAuth()
    const params = useLocalSearchParams();
    const [comments, setComments] = useState<any[]>([])
    const [text, setText] = useState<string>("")

    return (
        <KeyboardAvoidingView className='flex-1'
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView className='flex-1 items-center justify-center bg-white'>
                    
                    <FlatList
                        className='flex-1 w-full'
                        data={messages}
                        renderItem={({ item }) => {
                            return (
                                <View className='flex-row m-3 items-center gap-2 w-full'>
                                    <Image
                                        source={{ uri: 'https://placehold.co/40x40' }}
                                        className='w-10 h-10 rounded-full bg-black'
                                    />
                                    <View>
                                        <Text className='font-bold text-base'>{item.User.username}</Text>
                                        <Text>{item.text}</Text>
                                    </View>
                                </View>
                            )
                        }}
                    />
                    <View className='flex-row pb-2 gap-2 items-start justify-start w-full px-3'>
                        <TextInput
                            className='bg-white color-black p-4 rounded-3xl border border-gray-300 flex-1'
                            placeholder="Add a comment"
                            onChangeText={(i) => setText(i)}
                            value={text}
                            autoCapitalize='none'
                        />
                        <TouchableOpacity onPress={() => {
                            setText('')
                            Keyboard.dismiss()
                            addMessage(text)
                        }}>
                            <Ionicons name="arrow-forward-circle" size={50} color="red" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default Messages