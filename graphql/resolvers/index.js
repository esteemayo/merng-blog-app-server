const blogResolvers = require('./blogs');
const userResolvers = require('./users');
const commentResolvers = require('./comments');

module.exports = {
    Blog: {
        commentCount: parent => parent.comments.length,
        likeCount: parent => parent.likes.length,
    },
    Query: {
        ...blogResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...blogResolvers.Mutation,
        ...commentResolvers.Mutation
    },
    Subscription: {
        ...blogResolvers.Subscription
    }
}