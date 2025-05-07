import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Banner() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const apiKey = "641465ee224323fc3c600b59e38a8b0b";
    const base = "https://api.themoviedb.org/3";

    Promise.all([
      fetch(`${base}/genre/movie/list?api_key=${apiKey}&language=en-US`).then(
        (r) => r.json()
      ),
      fetch(
        `${base}/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`
      ).then((r) => r.json()),
    ])
      .then(([genreData, movieData]) => {
        if (!genreData.genres || !movieData.results) return;
        const genreMap = new Map(genreData.genres.map((g) => [g.id, g.name]));
        const top5 = movieData.results.slice(0, 5);
        const newSlides = top5.map((m) => ({
          image: m.backdrop_path
            ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
            : "/placeholder.png",
          title: m.title,
          genres: m.genre_ids
            .map((id) => ({ id, name: genreMap.get(id) }))
            .filter((g) => g.name),
          rating: `★ ${m.vote_average.toFixed(1)}`,
          desc: m.overview,
        }));
        setSlides(newSlides);
      })
      .catch((err) => console.error("Banner load error", err));
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(iv);
  }, [slides]);

  const goTo = (idx) => setCurrent((idx + slides.length) % slides.length);

  if (!slides.length) return null;

  return (
    <div className="banner" id="banner">
      {slides.map((b, i) => (
        <div
          key={i}
          className={`slide${i === current ? " active" : ""}`}
          style={{ backgroundImage: `url('${b.image}')` }}
        >
          <div className="overlay" />
          <div className="content">
            <div className="title-box">{b.title}</div>
            <div className="genres">
              {b.genres.map((g) => (
                <Link
                  key={g.id}
                  to={`/search?genre=${g.id}`}
                  className="genre-pill"
                >
                  {g.name}
                </Link>
              ))}
              <span className="rating">{b.rating}</span>
            </div>
            <p className="description">{b.desc}</p>
          </div>
        </div>
      ))}

      <button className="banner-arrow left" onClick={() => goTo(current - 1)}>
        &#10094;
      </button>
      <button className="banner-arrow right" onClick={() => goTo(current + 1)}>
        &#10095;
      </button>

      <div className="dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`dot${i === current ? " active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
