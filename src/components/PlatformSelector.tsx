import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const PLATFORMS = gql`
  query GetPlatforms {
    platforms {
      count,
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

interface PlatformSelectorProps {
  onChange: (id: string) => void
}

const PlatformSelector: React.FC<PlatformSelectorProps> = props => {
  const { loading, error, data } = useQuery(PLATFORMS);
  const [ platform, setPlatform ] = useState('')

  useEffect(
    () => {
      if (data) {
        props.onChange(data.platforms.edges[0].node.id);
        setPlatform(data.platforms.edges[0].node.id);
      }
    },
    [data],
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleChange = (id: string) => {
    props.onChange(id);
    setPlatform(id);
  };

  return (
    <div>
      {
        <select value={platform} onChange={e => handleChange(e.target.value)}>
          {
            data.platforms.edges.map((edge: any) => (
              <option key={edge.node.id} value={edge.node.id}>
                {edge.node.name}
              </option>
            ))
          }
        </select>
      }
    </div>
  );
}

export default PlatformSelector;