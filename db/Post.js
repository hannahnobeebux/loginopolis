const {Sequelize, sequelize} = require('./db');

const Post = sequelize.define('post', {
  title: Sequelize.STRING,
  description: Sequelize.STRING
});

module.exports = { Post };