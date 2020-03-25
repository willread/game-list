import { NowRequest, NowResponse } from '@now/node'
import fetch from 'isomorphic-unfetch';

export default async (req: NowRequest, res: NowResponse) => {
  const query = req.query.query; // TODO: Sanitize query
  const url = `https://www.giantbomb.com/api/search?api_key=${process.env.GIANTBOMB_API_KEY}&format=json&resources=game&query=${query}&limit=5&field_list=id,name,image`;
  const results = await (await fetch(url)).json();

  res.status(200).json(results.results);
}

