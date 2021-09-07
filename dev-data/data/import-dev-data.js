const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

// Models
const Blog = require('../../models/Blog');
const User = require('../../models/User');

dotenv.config({ path: './config.env' });

// Database local
const dbLocal = process.env.DATABASE_LOCAL;

// MongoDB Atlas
const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// MongoDB connection
mongoose
  .connect(db, {
    // mongoose.connect(dbLocal, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log(`Connected to MongoDB → ${db}`))
  // .then(() => console.log(`Connected to MongoDB → ${dbLocal}`))
  .catch((err) => console.error(err));

// Read JSON file
const blogs = JSON.parse(fs.readFileSync(`${__dirname}/blogs.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// Import data into DB
const importData = async () => {
  try {
    await Blog.create(blogs);
    await User.create(users, { validateBeforeSave: false });

    console.log('👍👍👍 Data successfully loaded! 👍👍👍');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

// Delete all data in the DB
const deleteData = async () => {
  try {
    console.log('😢😢 Goodbye Data...');

    await Blog.deleteMany();
    await User.deleteMany();

    console.log(
      'Data successfully deleted! To load sample data, run\n\n\t npm run sample\n\n'
    );
    process.exit();
  } catch (err) {
    console.log(
      '\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n'
    );
    console.error(err);
    process.exit();
  }
};

if (process.argv.includes('--delete')) {
  deleteData();
} else {
  importData();
}
