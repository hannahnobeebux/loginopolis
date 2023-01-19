const {User} = require('./User');
const {sequelize, Sequelize} = require('./db');
const { Post } = require('./Post');


//RELATIONSHIP 
User.hasMany(Post)
Post.belongsTo(User)

module.exports = {
    User,
    sequelize,
    Sequelize
};
