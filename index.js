import EnergyBase from './EnergyBase.js';
import fastify from 'fastify';

import config from './config.js';

const eb = new EnergyBase(config.energyBase);
// don't await, just already fire it off to make first load faster
eb.connect();
const app = fastify({
  logger: true,
});

app.get('/state', async (req, res) => {
  res.type('application/json').code(200);
  const result = await eb.update();
  app.log.info(`Fetched Update`, result);
  return result;
});

app.listen(config.web.port, (err, address) => {
  if (err) throw err;
  app.log.info(`server listening on ${address}`);
});
