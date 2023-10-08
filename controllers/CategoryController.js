const Joi = require('joi');
const Category = require('../models/Category.js');

// Joi schema for createCategory route
const createCategorySchema = Joi.object({
  title: Joi.string().required(),
});

// Create a new category
const createCategory = async (req, res) => {
  const { error } = createCategorySchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { title } = req.body;

  try {
    const categoryId = await Category.create(title);
    return 'Category created successfully';
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating category' });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    return categories;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting categories' });
  }
};
// Get all categories
const getAllCategoriesIdPost = async (postId) => {
  try {
    const categories = await Category.getAllPostId(postId);
    return categories;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting categories' });
  }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.getById(categoryId);
    return category;
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Category not found' });
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { title } = updateCategorySchema.validate(req.body);
  try {
    await Category.update(categoryId, title);
    return 'Category updated successfully';
  } catch (error) {
    console.error(error);
    return 'Category not found';
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    await Category.delete(categoryId);
    return 'Category deleted successfully';
  } catch (error) {
    console.error(error);
    return 'Category not found';
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategoriesIdPost,
};
