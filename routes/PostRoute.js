const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const { createPost, getAllPosts, getPostById, updatePost, deletePost } = require('../controllers/PostController.js');
const { createCategory, getAllCategories, getCategoryById, updateCategory, getAllCategoriesIdPost } = require('../controllers/CategoryController.js');

// Upload image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).single('image');

// Route to display the post CRUD view
router.get('/post', async (req, res) => {
  try {
    const posts = await getAllPosts(req, res);
    const categories = await getAllCategories(req, res);
    res.render('home', { posts, categories });
  } catch (error) {
    res.render('error', { error });
  }
}); 

router.get("/add", async (req, res) => {
  try {
    const categories = await getAllCategories(req, res);
    res.render("add", { categories });
  } catch (error) {
    res.render('error', { error });
  }
});

router.get("/addCategory", async (req, res) => {
  try {
    res.render("addCategory");
  } catch (error) {
    res.render('error', { error });
  }
});


// Route to create a new post (POST request)
router.post('/post', upload, async (req, res) => {
  try {
    await createPost(req, res);
    res.redirect('/post');
  } catch (error) {
    res.render('error', { error });
  }
});

// Route to display a specific post by ID
router.get('/post/:postId', async (req, res) => {
  try {
    const post = await getPostById(req, res);
    const categories = await getAllCategoriesIdPost(req.params.postId);
    res.render('postDetail', { post, categories });
  } catch (error) {
    res.render('error', { error });
  }
});

// Route to update a specific post by ID (POST request)
router.get('/post/update/:postId', async (req, res) => {
  try {
    const post = await getPostById(req, res);
    const categories = await getAllCategoriesIdPost(req.params.postId);
    res.render('update', { post, categories });
  } catch (error) {
    res.render('error', { error });
  }
});

// Route to update a specific post by ID (POST request)
router.post('/post/update/:postId', async (req, res) => {
  try {
    await updatePost(req, res);
    // Redirect back to the post CRUD view after successful update
    res.redirect('/post/' + req.params.postId);
  } catch (error) {
    res.redirect('/post/' + req.params.postId);
  }
});

// Route to delete a specific post by ID (POST request)
router.post('/post/delete/:postId', async (req, res) => {
  try {
    await deletePost(req, res);
    // Redirect back to the post CRUD view after successful deletion
    res.redirect('/post');
  } catch (error) {
    res.redirect('/post', { error });
  }
});

module.exports = router;
