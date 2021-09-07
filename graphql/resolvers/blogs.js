const { AuthenticationError, UserInputError } = require('apollo-server');

const Blog = require('../../models/Blog');
const auth = require('../../utils/auth');

module.exports = {
  Query: {
    getBlogs: async () => {
      try {
        const blogs = await Blog.find().sort('-createdAt');

        return blogs;
      } catch (err) {
        throw err;
      }
    },
    getBlog: async (_, { blogId }) => {
      try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
          throw new Error('No blog found with that ID');
        }
        return blog;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    createBlog: async (_, { content }, context) => {
      try {
        const user = await auth(context);

        if (content.trim() === '') {
          throw new UserInputError('Blog content must not be empty');
        }

        const blog = await Blog.create({
          content,
          user: user.id,
          username: user.username,
          createdAt: new Date().toISOString(),
        });

        context.pubsub.publish('NEW_BLOG', {
          newBlog: blog,
        });

        return blog;
      } catch (err) {
        throw err;
      }
    },
    updateBlog: async (_, { blogId, content }, context) => {
      try {
        const { username } = await auth(context);

        const blog = await Blog.findById(blogId);
        if (blog) {
          if (blog.username === username) {
            blog.content = content;
            blog.createdAt = new Date().toISOString();

            await blog.save();
            return blog;
          }
          throw new AuthenticationError(
            'Oops! You do not have permission to perform this action'
          );
        }
        throw new UserInputError('No blog was found with the given ID');
      } catch (err) {
        throw err;
      }
    },
    deleteBlog: async (_, { blogId }, context) => {
      const { username } = await auth(context);

      const blog = await Blog.findById(blogId);
      if (!blog) {
        throw new UserInputError('No blog found with the given ID');
      }

      if (blog.username === username) {
        await blog.delete();
        return 'Blog successfully deleted';
      }
      throw new AuthenticationError(
        'Oops! You do not have permission to perform this action'
      );
    },
    likeBlog: async (_, { blogId }, context) => {
      try {
        const { username } = await auth(context);

        const blog = await Blog.findById(blogId);
        if (!blog) {
          throw new UserInputError('No blog found with that given ID');
        }

        if (blog.likes.find((like) => like.username === username)) {
          blog.likes = blog.likes.filter((like) => like.username !== username);
        } else {
          blog.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        await blog.save();
        return blog;
      } catch (err) {
        throw err;
      }
    },
  },
  Subscription: {
    newBlog: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_BLOG'),
    },
  },
};
