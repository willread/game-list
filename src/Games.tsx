import { useQuery, gql } from '@apollo/client';

const GAMES = gql`
  query GetGames($cursor: String, $where: GameWhereInput) {
    games(
      first: 1,
      after: $cursor,
      where: $where
    ) {
      count,
      pageInfo {
        hasNextPage,
        hasPreviousPage,
        startCursor,
        endCursor,
      },
      edges {
        node {
          title,
          platform {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    }
  }
`;

function Games() {
  const platforms = ['PC', 'Mac'];
  let platform = undefined;

  const { loading, error, data, fetchMore } = useQuery(GAMES, {
    variables: {
      where: {
        platform: platform && {
          have: {
            name: { equalTo: platform },
          },
        },
      },
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      {(
        data.games.edges.map((edge: any) => (
          <div key={edge.node.title}>
            <p>
              {edge.node.title} / {edge.node.platform.edges[0].node.name}
            </p>
          </div>
        ))
      )}
      
      {data.games.pageInfo.hasNextPage &&
        <button onClick={() => fetchMore({
          variables: {
            cursor: data.games.pageInfo.endCursor,
          },
        })}>Next Page</button>
      }
    </div>
  );   
}

export default Games;