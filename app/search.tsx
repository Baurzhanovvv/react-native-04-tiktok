import { FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Header from '@/components/header'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'expo-router'

type Props = {}

const Search = (props: Props) => {
    const [searchText, setSearchText] = useState<string>()
    const [results, setResults] = useState();
    const router = useRouter();

    const search = async () => {
        const { data, error } = await supabase
            .from('User')
            .select('*')
            .eq('username', searchText)
        setResults(data);
    }

    return (
        <SafeAreaView className='flex-1'>
            <Header goBack={true} title="Search" color="black" search={false} />
            <View className='flex-row mt-5 gap-2 w-full px-3'>
                <TextInput
                    className='flex-1 bg-white p-4 rounded-3xl border border-gray-300'
                    placeholder='Search...'
                    onChangeText={(i) => setSearchText(i)}
                    value={searchText}
                />
                <TouchableOpacity onPress={search}>
                    <Ionicons name="arrow-forward-circle" size={50} color="red" />
                </TouchableOpacity>
            </View>
            <FlatList
                className='flex-1 w-full'
                data={results}
                renderItem={({ item: user }) =>
                    <TouchableOpacity onPress={() => router.push(`/user?user_id=${user.id}`)}>
                        <View className='flex-row m-3 items-center gap-2 w-full'>
                            <Image
                                source={{ uri: 'https://placehold.co/40x40' }}
                                className='w-10 h-10 rounded-full bg-black'
                            />
                            <View>
                                <Text className='font-bold text-base'>{user.username}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                }
            />
        </SafeAreaView>
    )
}

export default Search

const styles = StyleSheet.create({})