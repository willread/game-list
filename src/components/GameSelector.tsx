import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GAMES = gql`
  query GetGames {
    games {
      count,
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

interface GameSelectorProps {
  onChange: (id: string) => void
}

const GameSelector: React.FC<GameSelectorProps> = props => {
  const { loading, error, data } = useQuery(GAMES);
  const [ game, setGame ] = useState('')

  useEffect(
    () => {
      if (data) {
        setGame(data.games.edges[0].node.id);
        props.onChange(data.games.edges[0].node.id);
      }
    },
    [data],
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleChange = (id: string) => {
    props.onChange(id);
    setGame(id);
  };

  return (
    <div>
      {
        <select value={game} onChange={e => handleChange(e.target.value)}>
          {
            data.games.edges.map((edge: any) => (
              <option key={edge.node.id} value={edge.node.id}>
                {edge.node.title}
              </option>
            ))
          }
        </select>
      }
    </div>
  );
}

export default GameSelector;