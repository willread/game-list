import { NowRequest, NowResponse } from '@now/node';
import jwt from 'jsonwebtoken';

const authConfig = {
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_API_IDENTIFIER
};

// const checkJwt = jwt({
//   secret: process.env.AUTH0_CLIENT_SECRET,
//   audience: authConfig.audience,
//   issuer: `https://${authConfig.domain}/`,
//   algorithm: ["RS256"]
// });

async function handler(_req: NowRequest, res: NowResponse): Promise<void> {
  const token = _req.headers.authorization.replace('Bearer ', '');
  console.log('token', token);
  const jwtValid = jwt.verify(token, process.env.AUTH0_CLIENT_SECRET, {
    audience: authConfig.audience,
    issuer: `https://${authConfig.domain}/`,
    algorithms: ['RS256']
  });
  // This is your normal ZEIT Now function.
  res.json({ message: 'Everything OK.', jwtValid: jwtValid });
}

export default handler;
