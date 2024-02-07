"use client";
import  { FC } from 'react';
import { Bar } from "react-chartjs-2";
import "chart.js/auto";


interface Character {
  name: string;
  comics: {
    available: number;
  };
}

interface Props {
  characters: Character[];
}

const CharacterChart: FC<Props> = ({ characters }) => {
  const characterNames = characters.map(character => character.name);
  const comicsAppearedIn = characters.map(character => character.comics.available);

  const data = {
    labels: characterNames,
    datasets: [
      {
        label: 'Comics Appeared In',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: comicsAppearedIn
      }
    ]
  };

  return (
    <div >
      <h2 className='font-bold text-center text-2xl'>Characters by Comics Appeared In</h2>
      <Bar data={data} />
    </div>
  );
};

export default CharacterChart;
