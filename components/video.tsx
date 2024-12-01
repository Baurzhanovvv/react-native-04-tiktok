import { View, Text, Dimensions, TouchableOpacity, Share, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ResizeMode, Video } from 'expo-av'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/providers/AuthProvider'

type Props = {
    video: any,
    isViewable: boolean
}

const VideoPlayer = ({ video, isViewable }: Props) => {
    const { user, likes, getLikes, following, getFollowing } = useAuth()
    const videoRef = useRef<Video>(null)
    const router = useRouter()

    useEffect(() => {
        if (isViewable) {
            videoRef.current?.playAsync()
        } else {
            videoRef.current?.pauseAsync()
        }
    }, [isViewable])

    const shareVideo = () => {
        Share.share({
            message: `Check out this new video: ${video.title}`
        })
    }

    const likeVideo = async () => {
        const { data, error } = await supabase
            .from('Like')
            .insert({
                user_id: user?.id,
                video_id: video.id,
                video_user_id: video.User.id
            })
        if (error) return console.error(error)
        getLikes(user?.id)
    }

    const unLikeVideo = async () => {
        const { data, error } = await supabase
            .from('Like')
            .delete()
            .eq('user_id', user?.id)
            .eq('video_id', video.id)
        if (error) return console.error(error)
        getLikes(user?.id)
    }

    const followerUser = async () => {
        const { error } = await supabase
            .from("Follower")
            .insert({
                user_id: user?.id,
                follower_user_id: video.User.id
            })
        if (!error) getFollowing(user?.id)
    }

    const unFollowerUser = async () => {
        const { error } = await supabase
            .from("Follower")
            .delete()
            .eq('user_id', user?.id)
            .eq('follower_user_id', video.User.id)
        if (!error) getFollowing(user?.id)
    }

    return (
        <View>
            <Video
                ref={videoRef}
                style={{
                    flex: 1,
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                }}
                source={{
                    uri: video.signedUrl
                }}
                resizeMode={ResizeMode.COVER}
                isLooping
            // onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
            <View className='absolute bottom-32 left-0 right-0'>
                <View className='flex-1 flex-row justify-between items-end m-3'>
                    <View className='flex-column'>
                        <Text className='text-white text-2xl font-bold'>{video.User.username}</Text>
                        <Text className='text-white text-xl font-bold'>{video.title}</Text>
                    </View>
                    <View>
                        <View>
                            <TouchableOpacity onPress={() => router.push(`/user?user_id=${video.User.id}`)}>
                                <Image
                                    source={{ uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${video.User.id}/avatar.jpg` }}
                                    className='w-10 h-10 rounded-full bg-black'
                                />
                            </TouchableOpacity>
                            {
                                following.filter((following: any) => following.follower_user_id === video.User.id).length > 0 ? (
                                    <TouchableOpacity className='absolute -right-1 -bottom-1 bg-red-500 rounded-full items-center justify-center' onPress={unFollowerUser}>
                                        <Ionicons name="remove" size={21} color="white" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity className='absolute -right-1 -bottom-1 bg-red-500 rounded-full items-center justify-center' onPress={followerUser}>
                                        <Ionicons name="add" size={21} color="white" />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                        {
                            likes?.filter((like: any) =>
                                like.video_id === video.id).length > 0
                                ? (
                                    <TouchableOpacity className='mt-6' onPress={unLikeVideo}>
                                        <Ionicons name="heart" size={40} color="red" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity className='mt-6' onPress={likeVideo}>
                                        <Ionicons name="heart" size={40} color="white" />
                                    </TouchableOpacity>
                                )}

                        <TouchableOpacity className='mt-6' onPress={() => router.push(`/comment?video_id=${video.id}&video_user_id=${video.User.id}`)}>
                            <Ionicons name="chatbubble-ellipses" size={40} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity className='mt-6' onPress={shareVideo}>
                            <FontAwesome name="share" size={36} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default VideoPlayer