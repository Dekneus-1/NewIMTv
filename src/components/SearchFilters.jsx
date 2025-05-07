import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function SearchFilters() {
  const [genres, setGenres] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const key = "641465ee224323fc3c600b59e38a8b0b";
    fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=en-US`
    )
      .then((r) => r.json())
      .then((data) => setGenres(data.genres || []))
      .catch(() => setGenres([]));
  }, []);

  const update = (param, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(param, value);
    else params.delete(param);
    setSearchParams(params);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="search-filters">
      <select
        value={searchParams.get("genre") || ""}
        onChange={(e) => update("genre", e.target.value)}
      >
        <option value="">All Genres</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Min Year"
        value={searchParams.get("minYear") || ""}
        onChange={(e) => update("minYear", e.target.value)}
      />

      <input
        type="number"
        placeholder="Min Rating"
        step="0.1"
        value={searchParams.get("minRating") || ""}
        onChange={(e) => update("minRating", e.target.value)}
      />
    </div>
  );
}
