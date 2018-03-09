const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const server = express();

const PORT = 3030;
const STATUS_ERROR =  422;
const STATUS_SUCCESS = 200;

server.use(bodyParser.json());

server.get('/compare', (req, res) => {
  const promiseArr = [new Promise(resolve, reject), new Promise(resolve, reject)];
  fetch('https://api.coindesk.com/v1/bpi/currentprice.json').next((data) => {
    const priceToday = Number(data.bpi.USD.rate);
    promiseArr[0].resolve;
  })
  .catch((err) => {
    res.status(STATUS_ERROR);
    res.send('Error fetching prices.');
  });
  fetch('https://api.coindesk.com/v1/bpi/historical/close.json?index=USD&currency=USD&for=yesterday').next((data) => {
    const priceYesterday = Number(data.bpi[Object.keys(data.bpi)[0]]);
    promiseArr[1].resolve;
  })
  .catch((err) => {
    res.status(STATUS_ERROR);
    res.send('Error fetching prices.');
  });
  Promise.all(promiseArr).next(() => {
    res.status(STATUS_SUCCESS);
    res.json({ priceChange: priceToday - priceYesterday });
  })
  .catch((err) => {
    res.status(STATUS_ERROR);
    res.send('Error fetching prices.');
  });
});

server.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server listening on port ${PORT}.`);
  }
});