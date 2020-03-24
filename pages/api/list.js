import nextConnect from 'next-connect';

import auth0 from '../../lib/auth0'
import db from '../../lib/db';

const handler = nextConnect();

handler.use(db);

handler.get(async (req, res) => {
    const session = await auth0.getSession(req);

    if (session) {
        let doc = await req.db.collection('lists').findOne({ user: session.user.sub });
        res.status(200).json(doc);
    } else {
        res.status(500).json({error: ''});
    }
});

handler.post(async (req, res) => {
    const session = await auth0.getSession(req);

    if (session) {
        await req.db.collection('lists').update({ user: session.user.sub }, { $push: { games: req.body.game }});

        res.status(200).json({});
    } else {
        res.status(500).json({error: ''});
    }
});

export default handler;

