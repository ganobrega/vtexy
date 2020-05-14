import pPipe from 'p-pipe';

import identifyWebsite from './identifyWebsite';
import findLayout from './findLayout';
import parseTemplate from './parseTemplate';

export default async function(data, request, response) {
  let pipeline = pPipe(identifyWebsite /*findLayout, parseTemplate*/);

  return await pipeline({ request, response, data });
};