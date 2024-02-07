"use client";
import { useState, useEffect, FC, ChangeEvent } from "react";
import axios from "axios";
import md5 from "md5";
import Link from "next/link";
import CharacterChart from "@/src/components/CharacterChart";

const API_URL = "https://gateway.marvel.com/v1/public";
const PUBLIC_KEY = "7a9c16d84fa6d5cdfa92841d2a2beed4";
const PRIVATE_KEY = "b20c1993030998027b7076c2cbc67182195acb3e";

interface Character {
  id: number;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
  };
}

const CharactersList: FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // For Pagination
  const charactersPerPage = 20;
  const [searchTerm, setSearchTerm] = useState(""); // For searching

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const timestamp = new Date().getTime();
        const hash = md5(`${timestamp}${PRIVATE_KEY}${PUBLIC_KEY}`);
        const response = await axios.get(`${API_URL}/characters`, {
          params: {
            ts: timestamp,
            apikey: PUBLIC_KEY,
            hash: hash,
            offset: (currentPage - 1) * charactersPerPage,
            limit: charactersPerPage,
          },
        });
        setCharacters(response.data.data.results);
        setSelectedCharacters(response.data.data.results); // Initialize selected characters with all characters
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    };

    fetchCharacters();
  }, [currentPage]);

  useEffect(() => {
    const filteredCharacters = characters.filter((character) =>
      character.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSelectedCharacters(filteredCharacters);
  }, [characters, searchTerm]);
  console.log(characters);

  const handleCheckboxChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedCharacters((prevCharacters) => [
        ...prevCharacters,
        characters.find((character) => character.id === id)!,
      ]);
    } else {
      setSelectedCharacters((prevCharacters) =>
        prevCharacters.filter((character) => character.id !== id)
      );
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="mx-10">
      <h1 className="font-bold text-2xl text-center my-10">
        Marvel Characters
      </h1>
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by character name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border px-3 py-1 rounded-md w-56"
        />
      </div>
      <table className="border w-full mb-10">
        <thead className="underline">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Comics Appeared in</th>
            <th>Include in Chart</th>
            <th>Thumbnail</th>
          </tr>
        </thead>
        <tbody>
          {characters
            .filter((character) =>
              character.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((character) => (
              <tr key={character.id}>
                <td className="text-center hover:text-red-600">
                  <Link href={`/characters/${character.id}`}>
                    {character.name}
                  </Link>
                </td>
                <td className="max-w-96 text-ellipsis">
                  {character.description ? character.description : "N/A"}  
                </td>
                <td className="text-center">{character.comics.available}</td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={selectedCharacters.some(
                      (selectedCharacter) =>
                        selectedCharacter.id === character.id
                    )}
                    onChange={(e) =>
                      handleCheckboxChange(character.id, e.target.checked)
                    }
                  />
                </td>
                <td>
                  <img
                    src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                    alt={character.name}
                    height={100}
                    width={200}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 mb-20">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage}</span>
        <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>

      {/* Render character chart */}
      <CharacterChart characters={selectedCharacters} />
    </div>
  );
};

export default CharactersList;
