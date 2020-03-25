import nextConnect from 'next-connect';
import fetch from 'isomorphic-unfetch'

import config from '../../lib/config'
import auth0 from '../../lib/auth0'
import db from '../../lib/db';

const handler = nextConnect();

handler.use(db);

handler.get(async (req, res) => {
    const session = await auth0.getSession(req);

    if (session) {
        const query = req.query.query; // TODO: Sanitize query
        const url = `https://www.giantbomb.com/api/search?api_key=${config.GIANTBOMB_API_KEY}&format=json&resources=game&query=${query}&limit=5&field_list=id,name,image`;
        const results = await (await fetch(url)).json();

        res.status(200).json(results.results);
    } else {
        res.status(500).json({error: ''});
    }
});

export default handler;

