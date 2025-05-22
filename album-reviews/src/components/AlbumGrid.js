import React, { useEffect, useState } from "react";
import ratings from "../ratings";
import square1 from "../images/square1.jpg";
import square2 from "../images/square2.jpg";
import square3 from "../images/square3.jpg";
import square4 from "../images/square4.jpg";
import square6 from "../images/square6.jpg";
import square7 from "../images/square7.jpg";

const decorativeImages = [square1, square2, square3, square4, square6, square7];

const AlbumGrid = () => {
  const [albums, setAlbums] = useState([]);
  const [sortOption, setSortOption] = useState("title");

  //Gets album data from server
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

  //I hate when you have to scroll to "T" to find the *B*eatles
  const stripThe = (str) =>
    str.toLowerCase().startsWith("the ") ? str.slice(4) : str;

  //I don't need albums to say (Remaster) or (Deluxe)
  const stripParentheses = (str) => str.replace(/\s*\(.*?\)\s*/g, "").trim();


  //Sort albums
  const sortedAlbums = [...albums].sort((a, b) => {
    if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "artist") {
      return stripThe(a.artist).localeCompare(stripThe(b.artist));
    } else if (sortOption === "rating") {
      const ratingA = ratings[a.title] ?? -1;
      const ratingB = ratings[b.title] ?? -1;
      return ratingB - ratingA;
    } else {
      return 0;
    }
  });

  //Adds cows
  const combinedItems = [];
  const total = sortedAlbums.length + decorativeImages.length;
  const interval = Math.floor(total / decorativeImages.length);

  let albumIdx = 0;
  let decoIdx = 0;

  for (let i = 0; i < total; i++) {
    if (i % interval === 0 && decoIdx < decorativeImages.length) {
      combinedItems.push({ type: "decorative", src: decorativeImages[decoIdx++] });
    } else if (albumIdx < sortedAlbums.length) {
      combinedItems.push({ type: "album", data: sortedAlbums[albumIdx++] });
    }
  }

  return (
    //Sorting block
    <div className="min-h-screen w-full text-blue p-6">
      <div className="flex justify-center mb-4 mt-4">
        <div>
          <span className="mr-2 text-xl">Sort by:</span>
          {["title", "artist", "rating"].map((option) => (
            <button
              key={option}
              onClick={() => setSortOption(option)}
              className={`px-3 py-1 mr-2 rounded border text-xl ${
                sortOption === option
                  ? "black text-blue-600"
                  : "border-transparent text-black hover:border-white"
              } transition`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>


      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 m-10">
        {combinedItems.map((item, index) => {
          if (item.type === "decorative") {
            return (
              <div key={`decorative-${index}`} className="pointer-events-none">
                <img
                  src={item.src}
                  alt="Decorative square"
                  className="w-full rounded shadow-md"
                />
              </div>
            );
          }

          const album = item.data;
          const rating = ratings[album.title];

          return (
            <a
  key={`${album.title}-${index}`}
  href={album.link}
  target="_blank"
  rel="noopener noreferrer"
  className="block group"
>
  <div className="relative w-full">
    {/* Album Image */}
    <img
      src={album.image}
      alt={album.title}
      className="w-full rounded shadow-md transition duration-300 group-hover:brightness-50"
    />

    {/* Rating Overlay */}
    {rating && (
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex gap-[0.3em] mb-[0.3em] scale-[0.8] sm:scale-100">
          {Array.from({ length: Math.floor(rating) }).map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full ${
                rating === 5 ? "bg-yellow-400" : "bg-white"
              }`}
            />
          ))}
          {rating % 1 >= 0.5 && (
            <span
              className={`w-2 h-2 rounded-full opacity-50 ${
                rating === 5 ? "bg-yellow-400" : "bg-white"
              }`}
            />
          )}
        </div>

        <span
          className={`text-base sm:text-lg md:text-xl italic font-bold ${
            rating === 5 ? "text-yellow-400" : "text-white"
          }`}
        >
          {rating.toFixed(1)}
        </span>
      </div>
    )}
  </div>

  {/* Title */}
  <p className="mt-2 text-center text-md font-semibold text-blue-600">
    {stripParentheses(album.title)}
  </p>

  {/* Artist */}
  <p className="text-center text-sm font-semibold">{album.artist}</p>
</a>

          );
        })}
      </div>
    </div>
  );
};

export default AlbumGrid;
