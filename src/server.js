const express = require('express');
const app = express();
const config = require('../config.json');

const mongobdRouter = require('./mongodb/router');

app.use(function (error, req, res, next) {
  console.log(req);
  next();
});

app.use('/mongodb', mongobdRouter);

app.use('/health', (_, res) => {
  res.send("OK!");
});

app.use('/', (_, res) => {
  res.send('<a href="/mongodb">mongodb<a/>');
});

app.listen(config.port, function () {
  console.log(`Server app listening on port ${config.port}.`);
});