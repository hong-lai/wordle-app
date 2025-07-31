import { useRef, useState } from "react";

function useTimeoutMessage() {
    const [message, setMessage] = useState("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const setTimeoutMessage = (msg: string, duration: number = 2000) => {
        setMessage(msg);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            setMessage("");
            timeoutRef.current = null;
        }, duration);
    }

    return [message, setTimeoutMessage] as const;
}

export default useTimeoutMessage;