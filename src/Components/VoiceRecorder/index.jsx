import React, { useState } from 'react';
import "@amirseifi/react-voice-recorder/dist/style.css";
import { AudioRecorder } from "@amirseifi/react-voice-recorder";
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage';
import { useSelector } from 'react-redux';

const RecordVoiceMessage = ({ onSave, onClose }) => {
  const [isRecordMode, setIsRecordMode] = useState(false);
  const [audioSrc, setAudioSrc] = useState("");
  const user = useSelector((state) => state.Login.loggedIn);

  const onDataReady = (value) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target) {
        const audioData = event.target.result;
        setAudioSrc(audioData);
        const downloadURL = await saveAudioToFirebase(audioData);
        if (downloadURL) {
          onSave(downloadURL);
          onClose();
        }
      }
    };
    reader.readAsDataURL(value.value);
  };

  const saveAudioToFirebase = async (audioData) => {
    const storage = getStorage();
    const audioRef = storageRef(storage, `voiceMessages/${user.uid}/${Date.now()}.wav`);

    try {
      await uploadString(audioRef, audioData, 'data_url');
      const downloadURL = await getDownloadURL(audioRef);
      console.log('Audio saved successfully:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading audio:', error);
      return null;
    }
  };

  const onCancel = () => {
    setIsRecordMode(false);
    setAudioSrc("");
  };

  const onPermissionDenied = () => {
    setIsRecordMode(false);
    setAudioSrc("");
    alert("Permission Denied");
  };

  const handlePlay = () => {
    const audioElement = document.getElementById('audioPlayer');
    audioElement.play();
  };

  const handleStop = () => {
    const audioElement = document.getElementById('audioPlayer');
    audioElement.pause();
    audioElement.currentTime = 0;
  };

  const handleRecordClick = (e) => {
    e.stopPropagation();
    setIsRecordMode((prev) => !prev);
  };

  return (
    <div className="shadow-lg rounded-md p-2">
      {audioSrc && (
        <audio id="audioPlayer" src={audioSrc} controls onEnded={handleStop} />
      )}
      <div className='chat-control'>
        <div className='chat-control-container'>
          {!isRecordMode ? (
            <button onClick={handleRecordClick} className='font-fontInterRegular text-base'>Click To Record</button>
          ) : (
            <AudioRecorder
              onCancel={onCancel}
              onDataAvailable={onDataReady}
              onPermissionDenied={onPermissionDenied}
              isLogging
            />
          )}
          {audioSrc && !isRecordMode && (
            <button onClick={handlePlay}>Play</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordVoiceMessage;
