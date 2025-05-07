import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import SearchFilters from "../components/SearchFilters";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const apiKey = "641465ee224323fc3c600b59e38a8b0b";
    const genre = searchParams.get("genre");
    const q = searchParams.get("q");
    const minYear = searchParams.get("minYear");
    const minRating = searchParams.get("minRating");

    let url = "";
    if (genre) {
      url =
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}` +
        `&with_genres=${genre}`;
      if (minYear) url += `&primary_release_date.gte=${minYear}-01-01`;
      if (minRating) url += `&vote_average.gte=${minRating}`;
    } else if (q) {
      url =
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}` +
        `&query=${encodeURIComponent(q)}`;
    } else {
      setResults([]);
      return;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setResults(data.results);
          setError(null);
        } else {
          setResults([]);
          setError(data.status_message || "No results found");
        }
      })
      .catch(() => {
        setResults([]);
        setError("Network error");
      });
  }, [searchParams]);

  return (
    <section>
      <div className="search-header">
        <button
          className="filter-toggle"
          onClick={() => setShowFilters((v) => !v)}
          aria-label="Toggle filters"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button className="btn-back" onClick={() => navigate("/")}>
          ← Home
        </button>
      </div>

      {showFilters && <SearchFilters />}

      <h2>Search Results</h2>
      {error && <p className="error">{error}</p>}

      <ul className="search-results-list">
        {results.map((movie) => (
          <li key={movie.id} className="search-item">
            <Link to={`/movie/${movie.id}`}>
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : "/placeholder.png"
                }
                alt={movie.title}
              />
            </Link>
            <div className="info">
              <h3>
                <Link to={`/movie/${movie.id}`}>
                  {movie.title} ({movie.release_date?.slice(0, 4) || "N/A"})
                </Link>
              </h3>
              <p>{movie.overview}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
