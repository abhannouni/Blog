const express = require('express');

const router = express.Router();
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/CategoryController.js');

// Route to display the category CRUD view
router.get('/category', async (req, res) => {
  const categories = await getAllCategories(req, res);
  res.render('category', { categories });
});

// Route to create a new category (POST request)
router.post('/category', async (req, res) => {
  try {
    const successMessage = await createCategory(req, res);
    res.render('category', { successMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating category' });
  }
});

// Route to display a specific category by ID
router.get('/category/:categoryId', async (req, res) => {
  try {
    const category = await getCategoryById(req, res);
    res.render('categoryDetail', { category });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Category not found' });
  }
});

// Route to update a specific category by ID (POST request)
router.post('/category/update/:categoryId', async (req, res) => {
  try {
    await updateCategory(req, res);
    // Redirect back to the category CRUD view after successful update
    // res.redirect('/category');
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Category not found' });
  }
});

// Route to delete a specific category by ID (POST request)
router.post('/category/delete/:categoryId', async (req, res) => {
  try {
    await deleteCategory(req, res);
    // Redirect back to the category CRUD view after successful deletion
    res.redirect('/category-crud');
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Category not found' });
  }
});

module.exports = router;
