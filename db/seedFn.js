const {sequelize} = require('./db');
const {User} = require('./');
const users = require('./seedData');
const { Post } = require('./Post');
const bcrypt = require('bcrypt');

const seed = async () => {
  await sequelize.sync({ force: true }); // recreate db

  for (let i = 0; i < users.length; i++){
    users[i].password = await bcrypt.hash(users[i].password,10)
  }

  const allUsers = await User.bulkCreate(users);
  
  const posts = [
    {
      "title":"Exploring the Beauty of Nature",
      "description": "Join us on a journey through the great outdoors as we discover the breathtaking beauty of nature. From the majestic mountains to the sparkling seas, we will explore the wonders of the natural world and gain a deeper appreciation for the planet we call home."
    },
    {
      "title": "New Year, New You: Tips for Achieving Your Goals",
      "description": "Start the new year off on the right foot with our helpful tips for achieving your goals. From setting realistic targets to developing a plan of action, we will guide you through the process of turning your dreams into reality."
    },
    {
     "title": "The Power of Positive Thinking",
    "description": "Learn how to harness the power of positive thinking to improve your mental and physical well-being. Through a series of exercises and techniques, we will explore the impact of positive thoughts and attitudes on our overall health and happiness."
    },
    {
      "title": "Cooking with Fresh Ingredients",
      "description": "Discover the taste of freshness by learning how to cook with the season's best ingredients. From farm to table, our recipes and tips will help you create delicious meals that are both healthy and satisfying."
    },
    {
      "title": "Understanding the Importance of Financial Planning",
      "description": "Take control of your financial future by understanding the importance of planning. From budgeting to investment strategies, we will provide you with the tools and knowledge you need to make smart financial decisions and achieve your goals."
    }
  ]

  const allPosts = await Post.bulkCreate(posts); 

  await allUsers[0].addPost(allPosts[0]); 

};




module.exports = seed;
