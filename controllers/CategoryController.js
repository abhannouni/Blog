const { Post } = require('../models');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const sql = 'INSERT INTO posts (title, content) VALUES (?, ?)';
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating post' });
  }
};

// Read all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting posts' });
  }
};

// Update a post by ID
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  try {
    const [updatedRows] = await Post.update(req.body, {
      where: { id },
    });
    if (updatedRows > 0) {
      res.json({ message: 'Post updated successfully' });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating post' });
  }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await Post.destroy({
      where: { id },
    });
    if (deletedRows > 0) {
      res.json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting post' });
  }
};
