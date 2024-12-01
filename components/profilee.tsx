import { Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { supabase } from '@/utils/supabase'
import * as ImagePicker from 'expo-image-picker'
import { ResizeMode, Video } from 'expo-av'
import VideoPlayer from './video'

type Props = {
  user: any,
  followers: any,
  following: any,
}

const Profilee = ({ user, followers, following }: Props) => {
  const { user: authUser, signOut, following: myFollowing, getFollowing } = useAuth();

  const followerUser = async () => {
    const { error } = await supabase
      .from("Follower")
      .insert({
        user_id: authUser?.id,
        follower_user_id: user?.id
      })
    if (!error) getFollowing(user?.id)
  }

  const [profilePicture, setProfilePicture] = useState<string>('');

  const pickImage = async () => {
    if (authUser?.id !== user?.id) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });

    setProfilePicture(result.assets[0].uri);
    saveImage(result.assets[0].uri)
  };

  const saveImage = async (uri: string) => {
    const formData = new FormData();
    const filename = uri?.split('/').pop();
    const extension = filename?.split('.').pop()
    formData.append('file', {
      type: `image/${extension}`,
      name: `avatar.${extension}`,
      uri
    });

    const { data, error } = await supabase.storage
      .from(`avatars/${user?.id}`)
      .upload(`avatar.${extension}`, formData, {
        cacheControl: '360000000',
        upsert: true,
      });
    if (error) throw error;
  };

  const unFollowerUser = async () => {
    const { error } = await supabase
      .from("Follower")
      .delete()
      .eq('user_id', authUser?.id)
      .eq('follower_user_id', user?.id)
    if (!error) getFollowing(user?.id)
  }

  useEffect(() => {
    getVideos()
    getLikes()
  }, [])

  const [videos, setVideos] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const videoRef = useRef<Video>(null)

  const getSignedUrls = async (videos: any[]) => {
    const { data, error } = await supabase
      .storage
      .from('videos')
      .createSignedUrls(videos.map(video => video.uri), 60 * 60 * 24 * 7)

    let videosUrls = videos?.map((item) => {
      item.signedUrl = data?.find((signedUrl) => signedUrl.path === item.uri)?.signedUrl
      return item
    })

    setVideos(videosUrls)
  }

  const getVideos = async () => {
    const { data, error } = await supabase
      .from('Video')
      .select('*, User(*)')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(3)
    getSignedUrls(data)
  }

  const getLikes = async () => {
    const { data, error } = await supabase
      .from('Like')
      .select('*')
      .eq('video_user_id', user?.id)
      setLikes(data)
  }

  return (
    <SafeAreaView className='flex-1 items-center'>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: profilePicture || `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${user?.id}/avatar.jpg` }}
          className="w-20 h-20 rounded-full bg-black"
        />
      </TouchableOpacity>
      <Text className='text-2xl font-bold'>@{user?.username}</Text>
      <View className='flex-row items-center justify-around w-full my-5'>
        <View className='items-center justify-center'>
          <Text className='text-md font-semibold'>{following.length}</Text>
          <Text className='text-md font-semibold'>Following</Text>
        </View>
        <View className='items-center justify-center'>
          <Text className='text-md font-semibold'>{followers.length}</Text>
          <Text className='text-md font-semibold'>Followers</Text>
        </View>
        <View className='items-center justify-center'>
          <Text className='text-md font-semibold'>Likes</Text>
          <Text className='text-md'>{likes.length}</Text>
        </View>
      </View>
      {authUser?.id === user?.id ? (<TouchableOpacity
        onPress={signOut}
        className='bg-black px-4 py-2 rounded-lg'
      >
        <Text className='text-white font-bold text-3xl m-3'>
          Sign Out
        </Text>
      </TouchableOpacity>) : (
        <View>
          {
            myFollowing.filter((u: any) => u.follower_user_id === user?.id).length > 0 ? (
              <TouchableOpacity className='bg-black px-4 py-2 rounded-lg w-full m-3' onPress={unFollowerUser}>
                <Text className='text-white font-bold text-3xl'>
                  Unfollow
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className='bg-black px-4 py-2 rounded-lg w-full m-3' onPress={followerUser}>
                <Text className='text-white font-bold text-3xl'>
                  Follow
                </Text>
              </TouchableOpacity>
            )
          }
        </View>
      )}
      <FlatList
        data={videos}
        numColumns={3}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        className='mt-5'
        renderItem={({ item }) =>
          <Video
            ref={videoRef}
            style={{
              width: Dimensions.get('window').width*.333 - 10,
              height: 225,
              margin: 5,
            }}
            source={{ uri: item.signedUrl }}
            resizeMode={ResizeMode.COVER}
          />
        }
      />
    </SafeAreaView>
  )
}

export default Profilee