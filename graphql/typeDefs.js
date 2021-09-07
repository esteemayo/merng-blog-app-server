const { gql } = require('apollo-server');

module.exports = gql`
  type Blog {
    id: ID!
    content: String!
    username: String!
    user: String!
    comments: [Comment]!
    likes: [Like]!
    commentCount: Int!
    likeCount: Int!
    createdAt: String!
  }
  type Comment {
    id: ID!
    commentBody: String!
    username: String!
    createdAt: String!
  }
  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    name: String!
    username: String!
    email: String!
    password: String!
    passwordConfirm: String!
  }
  type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    password: String!
    passwordConfirm: String!
    createdAt: String!
    token: String!
  }
  type Query {
    getBlogs: [Blog]!
    getBlog(blogId: ID!): Blog!
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    createBlog(content: String!): Blog!
    updateBlog(blogId: ID!, content: String!): Blog!
    deleteBlog(blogId: ID!): String!
    createComment(blogId: ID!, commentBody: String!): Blog!
    updateComment(blogId: ID!, commentId: ID!, commentBody: String!): Blog!
    deleteComment(blogId: ID!, commentId: ID!): Blog!
    likeBlog(blogId: ID!): Blog!
  }
  type Subscription {
    newBlog: Blog!
  }
`;
