// index.js
const app = require('./app');
const config = require('./config/index');

const port = config.port;

app.listen(port, () => {
  console.log(`Server is up and running on ${port} ...`);
});