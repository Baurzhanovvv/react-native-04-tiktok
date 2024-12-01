import { View, Text, FlatList, Dimensions, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase';
import VideoPlayer from '@/components/video';
import Header from '@/components/header';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';


export default function Friends() {
  const { friends, following } = useAuth();
  const [videos, setVideos] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isFocused = useIsFocused()

  useEffect(() => {
    getVideos()
  }, [following])

  const getVideos = async () => {
    const { data, error } = await supabase
      .from('Video')
      .select('*, User(*)')
      .in('user_id', friends)
      .order('created_at', { ascending: false })
    getSignedUrls(data)
  }

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

  return (
    <View className='flex-1 items-center justify-center bg-black'>
      <View className='absolute top-20 left-0 right-0 z-10'>
        <Header goBack={false} title="Friends" color="white" />
      </View>
      <FlatList
        data={videos}
        snapToInterval={Dimensions.get('window').height}
        snapToStart
        decelerationRate={"fast"}
        className='flex-1'
        ListEmptyComponent={
          <View className="flex-1 mt-40 items-center justify-center bg-black">
            <Ionicons name="sad" size={40} color="white" />
            <Text className="text-white text-2xl font-bold">No Friends Yet</Text>
          </View>
        }
        onViewableItemsChanged={(e) => setActiveIndex(e.viewableItems[0]?.key)}
        renderItem={({ item }) => (
          <VideoPlayer video={item} isViewable={activeIndex === item.id && isFocused} />
        )}
      />
    </View>
  );
}
