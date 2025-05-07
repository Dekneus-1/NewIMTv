import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = "641465ee224323fc3c600b59e38a8b0b";
    const base = "https://api.themoviedb.org/3";

    Promise.all([
      fetch(`${base}/movie/${id}?api_key=${apiKey}&language=en-US`).then((r) =>
        r.json()
      ),
      fetch(`${base}/movie/${id}/videos?api_key=${apiKey}&language=en-US`).then(
        (r) => r.json()
      ),
      fetch(
        `${base}/movie/${id}/credits?api_key=${apiKey}&language=en-US`
      ).then((r) => r.json()),
    ])
      .then(([detailData, videoData, creditsData]) => {
        if (detailData.status_code) {
          setError(detailData.status_message);
          return;
        }
        setMovie(detailData);
        setCredits(creditsData);
        const trailer = videoData.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer?.key) setTrailerKey(trailer.key);
      })
      .catch(() => setError("Network error"));
  }, [id]);

  if (error) {
    return (
      <section className="movie-details">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <p className="error">{error}</p>
      </section>
    );
  }
  if (!movie) {
    return <p className="loading">Loading…</p>;
  }

  const director = credits.crew.find((c) => c.job === "Director");
  const writers = credits.crew.filter((c) =>
    ["Screenplay", "Writer", "Story"].includes(c.job)
  );
  const topCast = credits.cast.slice(0, 5);

  const year = movie.release_date?.slice(0, 4) || "N/A";
  const date = new Date(movie.release_date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hrs = Math.floor(movie.runtime / 60);
  const mins = movie.runtime % 60;
  const runtime = `${hrs}h ${mins}m`;

  return (
    <section className="movie-details">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="header">
        <div className="poster-col">
          <img
            className="poster"
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/placeholder.png"
            }
            alt={movie.title}
          />
        </div>

        <div className="main-col">
          <h1 className="title">
            {movie.title} <span className="year">({year})</span>
          </h1>

          <div className="meta-row">
            <span className="rating">★ {movie.vote_average.toFixed(1)}</span>
            <span className="dot">•</span>
            <span className="date">{date}</span>
            <span className="dot">•</span>
            <span className="runtime">{runtime}</span>
          </div>

          {trailerKey && (
            <div className="trailer-container">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?rel=0`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          )}

          <div className="action-buttons">
            {trailerKey && (
              <a
                className="btn-action"
                href={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch Trailer
              </a>
            )}
            {movie.imdb_id && (
              <a
                className="btn-action"
                href={`https://www.imdb.com/title/${movie.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on IMDb
              </a>
            )}
          </div>

          <div className="genres-row">
            {movie.genres.map((g) => (
              <Link
                key={g.id}
                to={`/search?genre=${g.id}`}
                className="genre-pill"
              >
                {g.name}
              </Link>
            ))}
          </div>

          <div className="credits-row">
            {director && (
              <p>
                <strong>Director:</strong> {director.name}
              </p>
            )}
            {writers.length > 0 && (
              <p>
                <strong>Writer{writers.length > 1 ? "s" : ""}:</strong>{" "}
                {writers.map((w) => w.name).join(", ")}
              </p>
            )}
            {topCast.length > 0 && (
              <p>
                <strong>Stars:</strong> {topCast.map((c) => c.name).join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="overview-section">
        <h2>Plot Summary</h2>
        <p>{movie.overview}</p>
      </div>

      {topCast.length > 0 && (
        <div className="cast-section">
          <h2>Top Billed Cast</h2>
          <div className="cast-list">
            {topCast.map((member) => (
              <div key={member.cast_id} className="cast-member">
                <img
                  src={
                    member.profile_path
                      ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                      : "/placeholder.png"
                  }
                  alt={member.name}
                />
                <p className="actor">{member.name}</p>
                <p className="character">{member.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
