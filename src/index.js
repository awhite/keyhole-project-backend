import express from 'express';

import routes from './routes';

const PORT = process.env.PORT || 8000;
const app = express();

app.use('/api/v1', routes);

const server = app.listen(PORT, process.env.IP, () => {
  console.log(`Listening on port ${PORT}`);
});
