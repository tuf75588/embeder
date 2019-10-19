const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello!' });
});

app.listen(port, () => console.log(`listening on https://localhost:${port}`));
