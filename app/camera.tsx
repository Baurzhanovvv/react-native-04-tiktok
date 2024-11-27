import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useRef } from 'react';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const { user } = useAuth()

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const recordVideo = async () => {
    if (isRecording) {
      setIsRecording(false)
      cameraRef.current?.stopRecording()
    } else {
      setIsRecording(true)
      const video = await cameraRef.current?.recordAsync()
      setVideoUri(video.uri)
    }
  }

  const saveVideo = async () => {
    const formData = new FormData();
    const filename = videoUri?.split('/').pop()
    formData.append('file', {
      uri: videoUri,
      type: `video/${videoUri?.split('.').pop()}`,
      name: filename
    })

    const { data, error } = await supabase.storage
      .from(`videos`)
      .upload(filename, formData, {
        cacheControl: '360000000',
        upsert: false
      })
    if (error) console.error(error);

    const {error: videoError} = await supabase.from('Video').insert({
      title: "Test title",
      uri: data?.path,
      user_id: user?.id,
    });
    if (videoError) console.error(error)
  }

  return (
    <CameraView mode="video" ref={cameraRef} style={{ flex: 1 }} facing={facing}>
      <View className='flex-1 justify-end'>
        <View className='flex-row items-center justify-around mb-10'>
          <TouchableOpacity className='flex-1 items-center justify-end' onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" color="white" size={0} />
          </TouchableOpacity>
          {videoUri ? (
            <TouchableOpacity className='flex-1 items-center justify-end' onPress={saveVideo}>
              <Ionicons name="checkmark-circle" color="white" size={100} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className='flex-1 items-center justify-end' onPress={recordVideo}>
              {!isRecording ? <Ionicons name="radio-button-on" color="white" size={100} /> : <Ionicons name="pause-circle" color="red" size={100} />}
            </TouchableOpacity>
          )}
          <TouchableOpacity className='flex-1 items-center justify-end' onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" color="white" size={50} />
          </TouchableOpacity>
        </View>
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
