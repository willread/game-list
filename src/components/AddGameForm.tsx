import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import GameSelector from './GameSelector';
import PlatformSelector from './PlatformSelector';

const ADD_GAME = gql`
  mutation createCollectionItem($game: ID!, $platform: ID!) {
    createCollectionItem(
      input: {
        fields: {
          game: {
            link: $game
          }
          platform: {
            link: $platform
          }
        }
      }
    ) {
      collectionItem {
        id
        createdAt
        game {
          title
        }
      }
    }
  }
`;

const AddGameForm: React.FC = () => {
  const [platform, setPlatform] = useState<string|undefined>(undefined);
  const [game, setGame] = useState<string|undefined>(undefined);
  const [addGame, { loading, error }] = useMutation(ADD_GAME, {
    variables: {
      platform,
      game,
    },
    onCompleted: data => {
        // TODO
    },
  });

  const handleSubmit = () => {
    addGame()
      .catch(e => {});
  };

  return (
    <div>
      <h1>Add a Game</h1>
      <GameSelector onChange={game => setGame(game)} />
      <PlatformSelector onChange={platform => setPlatform(platform)} />
      <button type="submit" onClick={handleSubmit} disabled={loading}>Add</button>
    
      {error && <div>
         <div>{error.message}</div>
      </div>}
    </div>
  );
};

export default AddGameForm;
