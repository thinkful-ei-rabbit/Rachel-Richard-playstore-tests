const express = require('express');
const morgan = require('morgan');
const playstore = require('./playstore/playstore');

const app = express();
app.use(morgan('dev'));

app.get('/apps', (req, res) => {
  let { sort, genres } = req.query;
  let results = [...playstore];
  let categories = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];

  if (sort) {
    sort = jsUcfirst(sort);
  }
  if (genres) {
    genres = jsUcfirst(genres);
  }

  if (sort && sort !== 'Rating' && sort !== 'App') {
    return res.status(400).send({ message: 'Sort must be by rating or app' });
  }

  if (sort === 'App') {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }

  if (sort === 'Rating') {
    results.sort((a, b) => {
      return b[sort] > a[sort] ? 1 : b[sort] < a[sort] ? -1 : 0;
    });
  }

  if (!categories.includes(genres)) {
    return res.status(400).send({ message: 'Genre does not exist.' });
  }

  if (genres && categories.includes(genres)) {
    results = results.filter((x) => {
      return x.Genres === genres;
    });
  }

  return res.json(results);
});

app.listen(8000, () => {
  console.log('Server going...');
});

function jsUcfirst(string) {
  string = string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}
