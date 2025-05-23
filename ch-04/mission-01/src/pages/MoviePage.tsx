import { useState } from "react"
import { MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";

export default function MoviePage() {
  
    const [page, setPage] = useState(1);

    const {category} = useParams<{
      category: string;
    }>();

    // 요청 url
    const url = `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}&api_key=${import.meta.env.VITE_TMDB_API_KEY}`

    // 커스텀 훅 사용
    const{data:movies, isPending, isError} = useCustomFetch<MovieResponse>(url);



  if (isError) {
    return (
    <div>
      <span className='text-red-500 text-2xl'>에러가 발생했습니다.</span>
      </div>
    )
  }

  return (
    <>
    <div className='flex item-center justify-center gap-6 mt-5'>
      <button 
      className='bg-[#0066ff] text-white px-6 py-3 rounded-lg shadow-md
      hover:bg-[#8ebbff] transition-all duration-200 disabled:bg-gray-300
      cursor-pointer disabled:cursor-not-allowed'
      disabled={page ===1}
      onClick={() : void => setPage((prev) : number => prev - 1)}>
        {`<`}
      </button>
      <span className='mt-3'>{page}페이지</span>
      <button 
      className='bg-[#0066ff] text-white px-6 py-3 rounded-lg shadow-md
      hover:bg-[#8ebbff] transition-all duration-200 cursor-pointer'
      onClick={() : void => setPage((prev) : number => prev + 1)}>
        {`>`}
      </button>
    </div>
    {isPending && (
      <div className='flex items-center justify-center h-dvh'>
        <LoadingSpinner />
      </div>
    )}

    {!isPending && (
      <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 
      lg:grid-cols-5 xl:grid-cols-6'>
          {movies?.results.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}

      </div>
    )}
    </>
  )
}
