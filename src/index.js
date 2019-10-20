const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const scraper = require('./scraper');

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/scrape', async (req, res) => {
  try {
    const { url } = req.query;
    const result = await scraper(url);
    res.json(result);
  } catch (error) {
    res.status(500);
    res.json({ error: error.message });
  }
});

app.listen(port, () => console.log(`listening on https://localhost:${port}`));
