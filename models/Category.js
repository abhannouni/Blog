const dbPool = require('../config/db');

const Category = {
  create: (title) => {
    return new Promise((resolve, reject) => {
      dbPool.query('INSERT INTO Category (title) VALUES (?)', [title], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results && results.insertId) {
          const categoryId = results.insertId;
          return resolve(categoryId);
        } else {
          return reject(new Error('Insert operation did not return expected results.'));
        }
      });
    });
  },

  getAll: () => {
    return new Promise((resolve, reject) => {
      dbPool.query('SELECT * FROM Category', (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },

  getAllPostId: (PostId) => {
    return new Promise((resolve, reject) => {
      dbPool.query('SELECT * FROM Category WHERE ?  IN (SELECT DISTINCT PostId FROM postcategories)',[PostId], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },

  getById: (categoryId) => {
    return new Promise((resolve, reject) => {
      dbPool.query('SELECT * FROM Category WHERE id = ?', [categoryId], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length === 0) {
          return reject({ message: 'Category not found' });
        }
        return resolve(results[0]);
      });
    });
  },

  update: (categoryId, title) => {
    return new Promise((resolve, reject) => {
      dbPool.query(
        'UPDATE Category SET title = ? WHERE id = ?',
        [title, categoryId],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          if (results.affectedRows === 0) {
            return reject({ message: 'Category not found' });
          }
          return resolve({ message: 'Category updated successfully' });
        }
      );
    });
  },

  delete: (categoryId) => {
    return new Promise((resolve, reject) => {
      dbPool.query('DELETE FROM Category WHERE id = ?', [categoryId], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.affectedRows === 0) {
          return reject({ message: 'Category not found' });
        }
        return resolve({ message: 'Category deleted successfully' });
      });
    });
  },
};

module.exports = Category;
