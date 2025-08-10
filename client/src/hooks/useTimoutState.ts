import { useCallback, useRef, useState } from "react";

function useTimeoutState<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setTimeoutValue = useCallback(async (_value: T, duration: number = -1) => {
    return new Promise((resolve) => {
      setValue(_value);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          setValue(initialValue);
          timeoutRef.current = null;

          resolve(true);
        }, duration);
      }
    })
  }, [initialValue]);

  return [value, setTimeoutValue] as const;
}

export default useTimeoutState;