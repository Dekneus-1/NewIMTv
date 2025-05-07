import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();
  const searchBarRef = useRef(null);
  const searchIconRef = useRef(null);
  const inputRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [visible, setVisible] = useState(
    window.innerWidth <= 768 ? window.scrollY === 0 : false
  );
  const [showIcon, setShowIcon] = useState(
    window.innerWidth <= 768 ? window.scrollY > 0 : false
  );
  const [overlayActive, setOverlayActive] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && !overlayActive) {
        const atTop = window.scrollY === 0;
        setVisible(atTop);
        setShowIcon(!atTop);
      }
    };
    window.addEventListener("scroll", handler);
    window.addEventListener("resize", handler);
    handler();
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [overlayActive]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isMobile) {
        if (e.clientY < 60) setVisible(true);
        else if (e.clientY > 120) setVisible(false);
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [isMobile]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (
        isMobile &&
        !overlayActive &&
        searchBarRef.current &&
        !searchBarRef.current.contains(e.target) &&
        searchIconRef.current &&
        !searchIconRef.current.contains(e.target)
      ) {
        setVisible(false);
        setShowIcon(true);
      }
    };
    document.body.addEventListener("click", onClickOutside);
    return () => document.body.removeEventListener("click", onClickOutside);
  }, [isMobile, overlayActive]);

  const doSearch = () => {
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setOverlayActive(false);
  };

  return (
    <>
      <div
        id="searchOverlay"
        className={overlayActive ? "active" : ""}
        onClick={() => setOverlayActive(false)}
      />

      <div
        id="searchBar"
        ref={searchBarRef}
        className={`search-bar${visible ? " visible" : ""}`}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOverlayActive(true)}
          onBlur={() => setOverlayActive(false)}
          onKeyUp={(e) => e.key === "Enter" && doSearch()}
        />
        <button aria-label="Search" onClick={doSearch}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 5 1.5-1.5-5-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
          </svg>
        </button>
      </div>

      <button
        id="searchIcon"
        ref={searchIconRef}
        className={showIcon ? "visible" : ""}
        aria-label="Show search"
        onClick={(e) => {
          e.stopPropagation();
          setVisible(true);
          setShowIcon(false);
          setOverlayActive(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
        <svg viewBox="0 0 24 24" width="34" height="34" fill="#fff">
          <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 5 1.5-1.5-5-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
        </svg>
      </button>
    </>
  );
}
