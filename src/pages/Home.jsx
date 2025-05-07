import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import MovieCarousel from "../components/MovieCarousel";

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    const apiKey = "641465ee224323fc3c600b59e38a8b0b";
    const base = "https://api.themoviedb.org/3";

    async function fetchSection(endpoint, setter) {
      try {
        const res = await fetch(
          `${base}${endpoint}?api_key=${apiKey}&language=en-US&page=1`
        );
        const json = await res.json();
        setter(json.results || []);
      } catch {
        setter([]);
      }
    }

    fetchSection("/trending/movie/week", setTrending);
    fetchSection("/movie/now_playing", setNowPlaying);
    fetchSection("/movie/top_rated", setTopRated);
  }, []);

  const mapMovies = (arr) =>
    arr.map((m) => ({
      id: m.id,
      img: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : "/placeholder.png",
      title: `${m.title} (${m.release_date?.slice(0, 4) || "N/A"})`,
    }));

  return (
    <>
      <Banner />
      <main id="mainContent">
        <MovieCarousel heading="Trending" movies={mapMovies(trending)} />
        <MovieCarousel heading="Now Playing" movies={mapMovies(nowPlaying)} />
        <MovieCarousel heading="Top Rated" movies={mapMovies(topRated)} />
      </main>
    </>
  );
}
