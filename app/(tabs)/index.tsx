import { View, Text, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase';
import VideoPlayer from '@/components/video';
import Header from '@/components/header';
import { useIsFocused } from '@react-navigation/native';



export default function HomeScreen() {
  const [videos, setVideos] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isFocused = useIsFocused()


  useEffect(() => {
    getVideos()
  }, [])

  const getVideos = async () => {
    const { data, error } = await supabase
      .from('Video')
      .select('*, User(*)')
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
    <View className='flex-1 items-center justify-center bg-white'>
      <View className='absolute top-20 left-0 right-0 z-10'>
        <Header title="For You" color="white" />
      </View>
      <FlatList
        data={videos}
        snapToInterval={Dimensions.get('window').height}
        snapToStart
        decelerationRate={"fast"}
        onViewableItemsChanged={e => setActiveIndex(e.viewableItems[0].key)}
        renderItem={({ item }) => <VideoPlayer video={item} isViewable={activeIndex === item.id && isFocused} />}
      />
    </View>
  );
}
