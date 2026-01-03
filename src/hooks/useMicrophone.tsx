import { useEffect, useRef, useState } from "react";

export function useMicrophone(audioCtx: AudioContext) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream>();
  const [audioContext, setAudioContext] = useState<AudioContext>(audioCtx);
  const timerRef = useRef(null);

  useEffect(() => {
    if ((audioStream === undefined || audioStream === null) && isRecording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setAudioStream(stream);
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    } else if (!isRecording) {
      setAudioStream(undefined);
    }

    return () => {
      if (timerRef.current) {
        // clearInterval(timerRef.current);
      }
    };
  }, [audioStream, isRecording]);

  if (!audioContext) {
    setAudioContext(audioCtx);
  }
  const audioSource = audioStream
    ? audioContext.createMediaStreamSource(audioStream)
    : null;
  const analyser = audioContext.createAnalyser();

  analyser.fftSize = 32768;
  analyser.minDecibels = -100;

  audioSource?.connect(analyser);

  return {
    audioStream,
    audioSource,
    audioContext,
    analyser,
    isRecording,
    setIsRecording,
  };
}
