import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value: T, delay = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // Ref lastExcecuted: 마지막으로 실행된 시간을 기록하는 변수
  const lastExcecuted = useRef<number>(Date.now());

  // useEffect:value, delay가 변경될 때 아래 로직 실행
  useEffect(() => {
    if (Date.now() >= lastExcecuted.current + delay) {
      lastExcecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timeId = setTimeout(() => {
        lastExcecuted.current = Date.now();
        setThrottledValue(value);
      }, delay);

      return () => clearTimeout(timeId);
    }
  }, [value, delay]);

  return throttledValue;
}

export default useThrottle;
