import React, { useEffect, useState } from "react";

const AlbumGrid = () => {
  const [albums, setAlbums] = useState([]);

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

  return (
    <div className="min-h-screen w-full  text-white p-6 ">
    <h1 className="text-3xl font-bold mb-6">Playlist Albums</h1>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {albums.map((album) => (
      <a
        key={album.id}
        href={album.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <img
          src={album.image}
          alt={album.name}
          className="w-full rounded shadow-md hover:scale-105 transition-transform"
        />
        <p className="mt-2 text-center text-sm font-semibold text-blue-400">
          {album.title}
        </p>
        <p className="text-center text-xs text-blue-300">{album.artist}</p>
      </a>
    ))}

    </div>
  </div>

  );
};

export default AlbumGrid;
