import React, { useEffect, useState } from "react";
import ratings from "../ratings";

const AlbumGrid = () => {
  const [albums, setAlbums] = useState([]);
  const [sortOption, setSortOption] = useState("title");

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const response = await fetch("http://localhost:4000/albums");
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    }
    fetchAlbums();
  }, []);

  const sortedAlbums = [...albums].sort((a, b) => {
    if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "artist") {
      return a.artist.localeCompare(b.artist);
    } else if (sortOption === "rating") {
      const ratingA = ratings[a.title] ?? -1;
      const ratingB = ratings[b.title] ?? -1;
      return ratingB - ratingA; // high to low
    } else {
      return 0;
    }
  });
  
  function getRatingColor(rating) {
    if (rating >= 5) return "text-blue-400";
    if (rating >= 4) return "text-green-400";
    if (rating >= 3) return "text-yellow-300";
    if (rating >= 2) return "text-orange-400";
    if (rating >= 1) return "text-red-400";
    return "text-white"; // fallback
  }

  return (
    <div className="min-h-screen w-full text-blue p-6">
      <div className="mb-4 mt-4">
        <span className="mr-2 font-semibold">Sort by:</span>
        {["title", "artist", "rating"].map((option) => (
          <button
            key={option}
            onClick={() => setSortOption(option)}
            className={`px-3 py-1 mr-2 rounded border ${
              sortOption === option
                ? "black text-blue-400"
                : "border-transparent text-black hover:border-white"
            } transition`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>


      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sortedAlbums.map((album, index) => {
          const albumKey = album.title; // or `${album.artist} - ${album.title}`.toLowerCase()
          const rating = ratings[albumKey];

          return (
            <a
              key={`${album.title}-${index}`}
              href={album.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block group"
            >
              {/* Album Image */}
              <img
                src={album.image}
                alt={album.title}
                className="w-full rounded shadow-md transition-opacity duration-300 group-hover:opacity-30"
              />

              {/* Rating Overlay */}
              {rating && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className={`text-2xl font-bold bg-black bg-opacity-70 px-4 py-2 rounded ${getRatingColor(rating)}`}>
                    {rating}
                  </span>
                </div>
              )}

              {/* Title + Artist */}
              <p className="mt-2 text-center text-sm font-semibold text-blue-400">
                {album.title}
              </p>
              <p className="text-center text-xs text-blue-300">{album.artist}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default AlbumGrid;
