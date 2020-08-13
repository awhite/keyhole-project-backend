import express from 'express';

import routes from './routes';

const PORT = 8001;
const app = express();

app.use('/', routes);

const server = app.listen(PORT, process.env.IP, () => {
  console.log(`Listening on port ${PORT}`);
});
