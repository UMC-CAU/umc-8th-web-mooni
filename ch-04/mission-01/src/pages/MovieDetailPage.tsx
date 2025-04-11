import { useParams } from "react-router-dom";
import { MovieDetail, CastMember, CrewMember } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useCustomFetch from "../hooks/useCustomFetch";
import { useState } from "react";

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  // 두 개의 요청 url
  // 상세 페이지 계속 깜빡이는 문제 발생 -> url에 const가 아니라 useState 사용
  const [url] = useState([
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR`,
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR`
  ]);
  

   // 커스텀 훅 사용 (데이터 타입은 튜플 형태)
   const { data, isPending, isError } = useCustomFetch<
   [MovieDetail, { cast: CastMember[]; crew: CrewMember[] }]
 >(url);

   // 로딩 중이거나 아직 데이터가 없으면 로딩 화면 표시
   if (isPending || !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // 에러 발생 시
  if (isError) {
    return (
      <div>
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }


  const [movie, credits] = data;
  const cast: CastMember[] = credits.cast.slice(0, 15); // 상위 15명만 보여줌
  const director: CrewMember | undefined = credits.crew.find(
    (person: CrewMember) => person.job === "Director" // credits.crew 배열에서 Director 한 명 찾기
  ); // 자동 추론이 안 될 경우 person 타입이 any가 되어버릴까봐 find()에 타입 지정


  return (
    <div className="bg-black text-white min-h-screen pb-12">
      <div
        className="h-[400px] bg-cover bg-center relative"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : "none",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent px-10 py-8 flex flex-col justify-end">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-lg mt-2">
            ⭐ {movie.vote_average} | {movie.release_date?.slice(0, 4)} | {movie.runtime}분
          </p>
          <p className="italic text-xl mt-2">"{movie.overview?.slice(0, 30)}..."</p>
        </div>
      </div>

      <section className="px-10 py-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">줄거리</h2>
        <p className="leading-relaxed text-gray-200">{movie.overview}</p>
      </section>

      <section className="px-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">감독/출연</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {director && (
            <div className="text-center">
              {director.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${director.profile_path}`}
                  alt={director.name}
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-2"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-gray-400 flex items-center justify-center text-2xl text-gray-500 mx-auto mb-2">
                  ?
                </div>
              )}
              <p className="font-semibold">{director.name}</p>
              <p className="text-sm text-gray-400">Director</p>
            </div>
          )}

          {cast.map((person) => (
            <div key={person.id} className="text-center">
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-2"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-gray-400 flex items-center justify-center text-2xl text-gray-500 mx-auto mb-2">
                  ?
                </div>
              )}
              <p className="font-semibold">{person.name}</p>
              <p className="text-sm text-gray-400">{person.character}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieDetailPage;
