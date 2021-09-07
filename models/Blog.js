const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    content: String,
    username: String,
    comments: [
        {
            commentBody: String,
            username: String,
            createdAt: String
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: String
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;