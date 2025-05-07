import React from "react";
import { Link } from "react-router-dom";

export default function MovieCarousel({ heading, movies }) {
  const scroll = (dir, e) => {
    const container = e.currentTarget.parentNode;
    const posters = container.querySelector(".posters");
    posters.scrollBy({ left: dir * posters.clientWidth, behavior: "smooth" });
  };

  return (
    <section>
      <h2>{heading}</h2>
      <div className="carousel">
        <div className="posters-container">
          <button className="arrow left" onClick={(e) => scroll(-1, e)}>
            &#10094;
          </button>
          <button className="arrow right" onClick={(e) => scroll(1, e)}>
            &#10095;
          </button>
          <div className="posters">
            {movies.map((m, i) => (
              <div className="movie" key={i}>
                <Link to={`/movie/${m.id}`}>
                  <img src={m.img} alt={m.title} />
                  <div className="movie-title">{m.title}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
