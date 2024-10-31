const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const url = require('url');
const proxy = require('http-proxy-middleware');
var bodyParser = require('body-parser');
var cors = require('cors');
var compression = require('compression');
var config = require('../config/config');
let projectRoute = require('../routes/project-route');
let restoreRoute = require('../routes/restore-route');
let historyRoute = require('../routes/history-route');
let detailRoute = require('../routes/detail-route');
let dataListRoute = require('../routes/data-list-route');
let publishRoute = require('../routes/publish-route');
let planRoute = require('../routes/plan-route');
let nginxRoute = require('../routes/nginx-route');
let versionRoute = require('../routes/version-route');
let logRoute = require('../routes/log-route');
const app = express();
try{
  fs.mkdirSync(path.resolve(__dirname, '../tem'));
}catch (e){
  console.error('tem文件夹已存在');
}

app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// 静态资源文件夹
app.use(express.static(path.join(__dirname, '../api')));
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/remove-api/project', projectRoute);
app.use('/remove-api/list', dataListRoute);
app.use('/remove-api/history', historyRoute);
app.use('/remove-api/detail', detailRoute);
app.use('/remove-api/publish', publishRoute);
app.use('/remove-api/plan', planRoute);
app.use('/remove-api/restore', restoreRoute);
app.use('/remove-api/nginx', nginxRoute);
app.use('/remove-api/version', versionRoute);
app.use('/remove-api/log', logRoute);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  if(req.app.get('env') === 'development'){
    res.locals.error = err;
  }else{
    res.locals.error = {};
  }

  let status = err.status || 500;
  // render the error page
  res.status(err.status || 500);
  res.end(status + '');
});
module.exports = app;
