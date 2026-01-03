import {useRef, useState} from "react";

export function useTimer() {

    const [timer, setTimer] = useState<number>(0);
    const [isRunning, setIsRunning] = useState(false);

    const timeInterval = useRef<NodeJS.Timeout>(undefined);

    const handleStart = () => {
        if (isRunning) return;
        setIsRunning(true);
        timeInterval.current = setInterval(() => {
            setTimer((prev) => prev + 100);
        }, 100);
    };


    const handleStop = () => {
        if (!isRunning) {
            handleReset()
            return
        }
        setIsRunning(false);
        clearInterval(timeInterval.current);
    };


    const handleReset = () => {
        setIsRunning(false);
        clearInterval(timeInterval.current);
        setTimer(0);
    };

    const formatTime = (timer: number) => {
        const minutes = Math.floor(timer / 60000)
            .toString()
            .padStart(2, "0");
        const seconds = Math.floor((timer / 1000) % 60)
            .toString()
            .padStart(2, "0");
        const milliseconds = (timer % 1000).toString()[0];

        return {minutes, seconds, milliseconds};
    };

    return {start: handleStart, stop: handleStop, time: formatTime(timer)};
}