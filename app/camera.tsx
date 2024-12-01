import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useRef } from 'react';
import { useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import { Video, ResizeMode } from 'expo-av'
import { useRouter } from 'expo-router';


export default function Camera() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [isRecording, setIsRecording] = useState(false);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [isVideoSaved, setIsVideoSaved] = useState(false); // Новое состояние
    const cameraRef = useRef<CameraView>(null);
    const videoRef = useRef<Video>(null);
    const router = useRouter()
    const [status, setStatus] = useState({ isLoaded: false, isPlaying: false });
    const { user } = useAuth();

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
            setIsRecording(false);
            cameraRef.current?.stopRecording();
        } else {
            setIsRecording(true);
            const video = await cameraRef.current?.recordAsync();
            setVideoUri(video.uri);
        }
    };

    const saveVideo = async () => {
        try {
            const formData = new FormData();
            const filename = videoUri?.split('/').pop();
            formData.append('file', {
                uri: videoUri,
                type: `video/${videoUri?.split('.').pop()}`,
                name: filename,
            });

            const { data, error } = await supabase.storage
                .from('videos')
                .upload(filename, formData, {
                    cacheControl: '360000000',
                    upsert: false,
                });
            if (error) throw error;

            const { error: videoError } = await supabase.from('Video').insert({
                title: 'Test title',
                uri: data?.path,
                user_id: user?.id,
            });
            if (videoError) throw videoError;

            alert('Видео успешно сохранено!');
            setIsVideoSaved(true);
        } catch (err) {
            console.error(err);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.1,
        });

        setVideoUri(result.assets[0].uri);
        console.log(result);
    };

    if (isVideoSaved) {
        router.push('/(tabs)')
    }

    return (
        <View className='flex-1'>
            {videoUri ? (
                <View className='flex-1'>
                    <TouchableOpacity className='absolute bottom-10 right-[35%] z-10' onPress={saveVideo}>
                        <Ionicons name="checkmark-circle" color="white" size={100} />
                    </TouchableOpacity>
                    <TouchableOpacity className='flex-1' onPress={() => status.isPlaying ? videoRef.current?.pauseAsync() : videoRef.current?.playAsync()}>
                        <Video
                            ref={videoRef}
                            style={{
                                flex: 1,
                                width: Dimensions.get('window').width,
                                height: Dimensions.get('window').height,
                            }}
                            source={{
                                uri: videoUri,
                            }}
                            resizeMode={ResizeMode.COVER}
                            isLooping
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                        />
                    </TouchableOpacity>
                </View>
            ) : (
                <CameraView mode="video" ref={cameraRef} style={{ flex: 1 }} facing={facing}>
                    <View className='flex-1 justify-end'>
                        <View className='flex-row items-center justify-around mb-10'>
                            <TouchableOpacity className='flex-1 items-center justify-end' onPress={pickImage}>
                                <Ionicons name="aperture" color="white" size={50} />
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
            )}
        </View>
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
