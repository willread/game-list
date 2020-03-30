import { MongoClient } from 'mongodb';
import { NowRequest, NowResponse } from '@now/node';

const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const user = 'google-oauth2|101459134272835055552';

export default async (req: NowRequest, res: NowResponse) => {
  await client.connect();
  await client.db('gamelist').collection('lists').updateOne({ user }, { $push: { games: req.body.game }});
  res.status(200).json({});
}
