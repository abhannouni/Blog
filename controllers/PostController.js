const Joi = require('joi');
const Post = require('../models/Post.js');

// Joi schema for createPost route
const createPostSchema = Joi.object({
  title: Joi.string().required(),
  categories: Joi.string().pattern(/^\d+(,\d+)*$/).required(),
  content: Joi.string().max(300).required(),
});

// Joi schema for updatePost route
const updatePostSchema = Joi.object({
  // title: Joi.string().required(),
  // categories: Joi.string().pattern(/^\d+(,\d+)*$/).required(),
  // content: Joi.string().max(300).required(),
});

// Joi schema for getAll route
const getAllSchema = Joi.object({
  page : Joi.number().positive().greater(0).required()
})

// Create a new post with associated categories
const createPost = async (req, res) => {
  const { error } = createPostSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  console.log(req.body);
  const { title, content ="", categories } = req.body;
  const categoryIds = categories.split(',').map(Number);
  const image = req.file.filename;

  try {
    const postId = await Post.create(title, image, content, categoryIds);
    return 'Post created successfully';
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating post' });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  const search = req.query.search ? req.query.search : "";
  const categoryId = req.query.categoryId ? req.query.categoryId : undefined;
  try {
    const posts = await Post.getAll(search,categoryId);
    return posts;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting posts' });
  }
};

// Get a post by ID
const getPostById = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.getById(postId);
    return post;
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Post not found' });
  }
};

// Update a post by ID
const updatePost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.getById(postId);
  console.log(post);
  const title = req.body.title === "" ? req.body.title : post.title;
  const content =  req.body.content === "" ? req.body.content : post.content;

  try {
    await Post.update(postId, title, content);
    return 'Post updated successfully';
  } catch (error) {
    console.error(error);
    return 'Post not found';
  }
};


// Delete a post by ID
const deletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    await Post.delete(postId);
    return 'Post deleted successfully';
  } catch (error) {
    console.error(error);
    return 'Post not found';
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
