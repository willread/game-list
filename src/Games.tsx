import { useQuery, gql } from '@apollo/client';

const GAMES = gql`
  query GetCollectionItems($cursor: String, $where: CollectionItemWhereInput) {
    collectionItems(
      first: 999
      after: $cursor
      where: $where
    ) {
      count,
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      },
      edges {
        node {
          id
          game {
            title
          }
          platform {
            name
          }
        }
      }
    }
  }
`;

function Games() {
  const platforms = ['PC', 'Mac', 'Xbox'];
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
        data.collectionItems.edges.map((edge: any) => (
          <div key={edge.node.id}>
            <p>
              {edge.node.game.title} / {edge.node.platform.name}
            </p>
          </div>
        ))
      )}
      
      {data.collectionItems.pageInfo.hasNextPage &&
        <button onClick={() => fetchMore({
          variables: {
            cursor: data.collectionItems.pageInfo.endCursor,
          },
        })}>Next Page</button>
      }
    </div>
  );   
}

export default Games;