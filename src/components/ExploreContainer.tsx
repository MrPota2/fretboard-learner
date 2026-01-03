import "./ExploreContainer.css";
import { IonButton, IonText } from "@ionic/react";
import { useTimer } from "../hooks/useTimer";
import { useNotes } from "../hooks/useNotes";
import { useMicrophone } from "../hooks/useMicrophone";
import { useCallback, useRef, useState } from "react";

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = () => {
  const timer = useTimer();
  const [noteFromAudio, setNoteFromAudio] = useState<string>("none :<");
  const [randomChromatic, setRandomChromatic] = useState<string>("none :<");
  const { getRandomChromatic, getNoteFromAudio } = useNotes();
  const audioContext = new window.AudioContext();
  const timeRef = useRef<NodeJS.Timeout>(undefined);
  const { audioStream, analyser, isRecording, setIsRecording } =
    useMicrophone(audioContext);

  const update = useCallback(() => {
    setNoteFromAudio(getNoteFromAudio(analyser));
    setRandomChromatic(getRandomChromatic);
  }, [analyser, getNoteFromAudio, getRandomChromatic]);

  if (isRecording && !timeRef.current) {
    timeRef.current = setInterval(() => {
      update();
    }, 100);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1>{randomChromatic}</h1>
      <h2>{noteFromAudio}</h2>

      <IonText>
        Elapsed time: {timer.time.minutes}:{timer.time.seconds}:
        {timer.time.milliseconds}
      </IonText>
      <div>
        <IonButton
          onClick={() => {
            timer.start();
            setIsRecording(true);
          }}
        >
          Start
        </IonButton>
        <IonButton
          onClick={() => {
            timer.stop();
            clearInterval(timeRef.current);
            setIsRecording(false);
          }}
        >
          Stop
        </IonButton>
        <IonButton
          onClick={() => {
            if (!audioStream || !audioContext || !isRecording) return;
          }}
        >
          Get note from audio
        </IonButton>
      </div>
    </div>
  );
};

export default ExploreContainer;
