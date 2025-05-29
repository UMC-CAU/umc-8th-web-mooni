import { useEffect, useState } from "react";
import { effect } from "zod";

function useDebounce<T>(value: T, delay: number) {
  const [debounceValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounceValue;
}

export default useDebounce;
