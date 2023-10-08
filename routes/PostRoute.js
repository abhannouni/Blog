const express =require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const  { createPost, getAllPosts, getPostById, updatePost, deletePost } =require( '../controllers/PostController.js');
const  { createCategory, getAllCategories, getCategoryById, updateCategory, getAllCategoriesIdPost } =require( '../controllers/CategoryController.js');

//uplaod image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage }).single('image');

// Route to display the post CRUD view
router.get('/post', async (req, res) => {
  const posts = await getAllPosts(req,res);
  const categories = await getAllCategories(req,res);
  res.render('home', {posts,categories} );
}); 

// Route to create a new post (POST request)
router.post('/post', upload, async (req, res) => {
  try {
    const successMessage = await createPost(req, res);
    res.render('home', { successMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating post' });
  }
});

// Route to display a specific post by ID
router.get('/post/:postId', async (req, res) => {
  try {
    const post = await getPostById(req,res);
    const categories = await getAllCategories(req.params.postId);
    res.render('postDetail', { post, categories });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Post not found' });
  }
});

// Route to update a specific post by ID (POST request)
router.post('/post/update/:postId', async (req, res) => {
  try {
    await updatePost(req, res);
    // Redirect back to the post CRUD view after successful update
    // res.redirect('/post');
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Post not found' });
  }
});

// Route to delete a specific post by ID (POST request)
router.post('/post/delete/:postId', async (req, res) => {
  try {
    await deletePost(req,res);
    // Redirect back to the post CRUD view after successful deletion
    res.redirect('/post-crud');
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Post not found' });
  }
});


module.exports = router;