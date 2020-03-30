import { MongoClient } from 'mongodb';
import { NowRequest, NowResponse } from '@now/node';

const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const user = 'google-oauth2|101459134272835055552';

export default async (req: NowRequest, res: NowResponse) => {
  await client.connect();

  const doc = await client.db('gamelist').collection('lists').findOneAndUpdate(
    { user },
    {
        $setOnInsert: {
            user: user.sub,
            games: []
        }
    },
    {
        returnNewDocument: true,
        upsert: true
    }
  );

  if (doc.ok) {
    res.status(200).json(doc.value);
  } else {
    res.status(500).json({error: ''});
  }
}
