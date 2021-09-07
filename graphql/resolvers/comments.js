const { AuthenticationError, UserInputError } = require('apollo-server');

const Blog = require('../../models/Blog');
const auth = require('../../utils/auth');

module.exports = {
    Mutation: {
        createComment: async (_, { blogId, commentBody }, context) => {
            try {
                const { username } = await auth(context);
    
                if (commentBody.trim() === '') {
                    throw new UserInputError('Empty commentBody', {
                        errors: {
                            commentBody: 'Comment body must not be empty'
                        }
                    });
                }
    
                const blog = await Blog.findById(blogId);
                if (!blog) {
                    throw new UserInputError('No blog found with the given ID');
                }
    
                blog.comments.unshift({
                    commentBody,
                    username,
                    createdAt: new Date().toISOString()
                });
    
                await blog.save();
                return blog;

            } catch (err) {
                throw err;
            }
        },
        updateComment: async (_, { blogId, commentId, commentBody }, context) => {
            try {
                const { username } = await auth(context);

                const blog = await Blog.findById(blogId);

                if (blog) {
                    const commentIndex = blog.comments.findIndex(c => c.id === commentId);

                    if (blog.comments[commentIndex].username === username) {
                        blog.comments[commentIndex].commentBody = commentBody;
                        blog.comments[commentIndex].createdAt = new Date().toISOString();

                        await blog.save();
                        return blog;
                    }
                    throw new AuthenticationError('Oops! You do not have permission to perform this action');
                }
                throw new UserInputError('No blog found with the given ID');
            } catch (err) {
                throw err;
            }
        },
        deleteComment : async (_, { blogId, commentId }, context) => {
            try {
                const { username } = await auth(context);
                
                const blog = await Blog.findById(blogId);
                if (!blog) {
                    throw new UserInputError('No blog found with the given ID');
                }

                const commentIndex = blog.comments.findIndex(c => c.id === commentId);

                if (blog.comments[commentIndex].username === username) {
                    blog.comments.splice(commentIndex, 1);
                    await blog.save();
                    return blog;
                }
                throw new AuthenticationError('Oops! You do not have permission to perform this action');
            } catch (err) {
                throw err;
            }
        }
    }
};