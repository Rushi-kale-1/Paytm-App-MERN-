const express = require('express');
const UserRouter = require('./userroute');
const MainRouter = express.Router();

MainRouter.use('/user', UserRouter);

module.exports = MainRouter;
