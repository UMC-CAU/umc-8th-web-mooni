import axios from "axios";
import { useEffect, useState } from "react";

// 제네릭을 사용해 다양한 응답 타입을 받을 수 있도록 함
interface ApiResponse<T> {
  data: T | null;           // 받아온 데이터를 저장할 상태
  isPending: boolean;      // 로딩 중인지 나타내는 상태
  isError: boolean;        // 에러가 발생했는지 나타내는 상태
}

// useCustomFetch 훅 정의 (url은 string 또는 string[] 가능)
function useCustomFetch<T>(url: string | string[]): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null); // 응답 데이터를 저장할 상태
  const [isPending, setIsPending] = useState(false); // 로딩 상태
  const [isError, setIsError] = useState(false);     // 에러 상태

  // url이 변경될 때마다 실행
  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);   // 로딩 시작
      setIsError(false);    // 에러 초기화

      try {
        // url이 여러 개일 경우 병렬 요청
        if (Array.isArray(url)) {
          const responses = await Promise.all(url.map((u) => axios.get(u))); // 여러 요청 동시에 보냄
          const results = responses.map((res) => res.data); // 응답 데이터만 추출
          setData(results as T); // 데이터 상태에 저장
        } else {
          // 단일 요청일 경우
          const response = await axios.get(url); // 요청 보냄
          setData(response.data as T); // 응답 데이터 저장
        }
      } catch {
        setIsError(true); // 에러 발생 시 true
      } finally {
        setIsPending(false); // 로딩 종료
      }
    };

    fetchData(); // 함수 실행
  }, [url]); 

  // 훅 결과 반환
  return { data, isPending, isError };
}

export default useCustomFetch;