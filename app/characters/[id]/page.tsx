"use client";

import  { useState, useEffect, FC } from "react";
import axios from "axios";
import md5 from "md5";
import { useParams } from "next/navigation";

const API_URL = "https://gateway.marvel.com/v1/public/characters";
const PUBLIC_KEY = "7a9c16d84fa6d5cdfa92841d2a2beed4";
const PRIVATE_KEY = "b20c1993030998027b7076c2cbc67182195acb3e";

interface Character {
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
  };
  series: {
    available: number;
  };
  // Add more properties as needed
}

const CharacterProfile: FC = () => {
  const { id } = useParams();

  const [characters, setCharacters] = useState<Character | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const timestamp = new Date().getTime();
        const hash = md5(`${timestamp}${PRIVATE_KEY}${PUBLIC_KEY}`);
        const response = await axios.get(`${API_URL}/${id}`, {
          params: {
            ts: timestamp,
            apikey: PUBLIC_KEY,
            hash: hash,
          },
        });
        setCharacters(response.data.data.results[0]);
      } catch (error) {
        console.error("Error fetching character:", error);
      }
    };

    if (id) {
      fetchCharacter();
    }
  }, [id]);

  if (!characters) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-10 flex space-x-10 my-10 items-center text-xl bg-red-800 text-white">
      <img
        src={`${characters.thumbnail.path}.${characters.thumbnail.extension}`}
        alt={characters.name}
        height={500}
        width={500}
      />
      <div>
        <h2>
          <span className="font-bold underline">Name:</span> {characters.name}
        </h2>
        <p>
          <span className="font-bold underline">Description:</span>{" "}
          {characters.description}
        </p>
        <p>
          <span className="font-bold underline">Comics Appeared In:</span>{" "}
          {characters.comics.available}
        </p>
        <p>
          <span className="font-bold underline">Series:</span>{" "}
          {characters.series.available}
        </p>
        <p>
          <span className="font-bold underline">Thumbnail:</span>{" "}
          {characters.thumbnail.path}.{characters.thumbnail.extension}
        </p>
      </div>
    </div>
  );
};

export default CharacterProfile;
