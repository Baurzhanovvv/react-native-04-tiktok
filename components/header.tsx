import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Props = {
    title: string;
    color: string;
    goBack?: boolean;
    search?: boolean;
}

const Header = ({ title, color, goBack = false, search = true }: Props) => {
    const router = useRouter();

    return (
        <View className='mx-4 flex-row items-center justify-between'>
            <View className='w-10'>
                {goBack && (
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={32} color={color} />
                    </TouchableOpacity>
                )}
            </View>
            <Text className={`text-${color} font-bold text-3xl`}>{title}</Text>
            <View className='w-10'>
                {search && (
                    <TouchableOpacity onPress={() => router.push('/search')}>
                        <Ionicons name="search" size={28} color={color} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default Header