
import auth0 from '../../lib/auth0'
import db from '../../lib/db';

const user = 'google-oauth2|101459134272835055552';

handler.get(async (req, res) => {
    const session = await auth0.getSession(req);

    if (session) {
        let doc = await req.db.collection('lists').findOneAndUpdate(
            { user: session.user.sub },
            {
                $setOnInsert: {
                    user: session.user.sub,
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
    } else {
        res.status(500).json({error: ''});
    }
});

handler.post(async (req, res) => {
  await req.db.collection('lists').update({ user: session.user.sub }, { $push: { games: req.body.game }});
});

export default handler;


// import { MongoClient } from 'mongodb';
// import nextConnect from 'next-connect';

// const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// async function database(req, res, next) {
//   if (!client.isConnected()) await client.connect();
//   req.dbClient = client;
//   req.db = client.db('gamelist');
//   return next();
// }

// const middleware = nextConnect();

// middleware.use(database);

// export default middleware;
