import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { MovieDetail, CastMember, CrewMember } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [director, setDirector] = useState<CrewMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);

        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR`
        );

        const creditsRes = await axios.get<{
          cast: CastMember[];
          crew: CrewMember[];
        }>(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR`
        );

        setMovie(movieResponse.data);

        const topCast = creditsRes.data.cast.slice(0, 15);
        const directorInfo = creditsRes.data.crew.find(
          (person) => person.job === "Director"
        );

        setCast(topCast);
        setDirector(directorInfo || null);
      } catch {
        setError("영화 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) return <p className="text-red-500">{error}</p>;
  if (!movie) return null;

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
