import React from 'react';
import { graphql, QueryRenderer } from 'react-relay';

import environment from  '../relay-env';

const QUERY = graphql`
query RelayTest_CollectionItemQuery {
  collectionItem {
    id
    purchasePrice
  }
}
`;

const RelayTest: React.FC = (props: any) => {
  return (
    <QueryRenderer
      environment={environment}
      query={QUERY}
      variables={{}}
      render={({error, props}) => {
        if (error) {
          return <div>Error!</div>;
        }
        if (!props) {
          return <div>Loading...</div>;
        }
        return <div>{JSON.stringify(props)}</div>;
      }}
    />
  );
};

export default RelayTest;
