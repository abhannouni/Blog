const { query } = require('express');
const dbPool = require('../config/db');
const { search } = require('../routes/PostRoute');

const Post = {
  create: (title, image, content , categoryIds) => {
    return new Promise((resolve, reject) => {
      dbPool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.beginTransaction((err) => {
          if (err) {
            connection.release();
            return reject(err);
          }
  
          connection.query(
            'INSERT INTO Post (title, image, content) VALUES (?, ?, ?)',
            [title, image, content],
            (err, results) => {
              if (err) {
                connection.rollback(() => {
                  connection.release();
                  return reject(err);
                });
              }

              // Check if 'results' is defined and contains an 'insertId' property
              if (results && results.insertId) {
                const postId = results.insertId;
                
                const postCategoryValues = categoryIds.map((categoryId) => [postId, categoryId]);
  
                connection.query(
                  'INSERT INTO PostCategories (postId, categoryId) VALUES ?',
                  [postCategoryValues],
                  (err) => {
                    if (err) {
                      connection.rollback(() => {
                        connection.release();
                        return reject(err);
                      });
                    }
  
                    connection.commit((err) => {
                      if (err) {
                        connection.rollback(() => {
                          connection.release();
                          return reject(err);
                        });
                      }
  
                      connection.release();
                      return resolve(postId);
                    });
                  }
                );
              } else {
                // Handle the case when 'results' is not as expected
                connection.release();
                return reject(new Error('Insert operation did not return expected results.'));
              }
            }
          );
        });
      });
    });
  },
  

  getAll: (search, categoryId) => {
    return new Promise((resolve, reject) => {
      let qry;
      let params = [`${search}%`]; // Initialize with the search parameter
  
      if (categoryId) {
        qry = "SELECT * FROM Post WHERE ? IN (SELECT DISTINCT categoryId FROM postcategories) AND title LIKE ?;";
        params.unshift(categoryId); // Add categoryId to the beginning of the params array
      } else {
        qry = "SELECT * FROM Post WHERE title LIKE ?;";
      }
  
      dbPool.query(qry, params, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },

  getById: (postId) => {
    return new Promise((resolve, reject) => {
      dbPool.query('SELECT * FROM Post WHERE id = ?', [postId], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length === 0) {
          return reject({ message: 'Post not found' });
        }
        return resolve(results[0]);
      });
    });
  },

  update: (postId, title, image, content) => {
    return new Promise((resolve, reject) => {
      dbPool.query(
        'UPDATE Post SET title = ?, image = ?, content = ? WHERE id = ?',
        [title, image, content, postId],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          if (results.affectedRows === 0) {
            return reject({ message: 'Post not found' });
          }
          return resolve({ message: 'Post updated successfully' });
        }
      );
    });
  },

  delete: (postId) => {
    return new Promise((resolve, reject) => {
      dbPool.query('DELETE FROM Post WHERE id = ?', [postId], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.affectedRows === 0) {
          return reject({ message: 'Post not found' });
        }
        return resolve({ message: 'Post deleted successfully' });
      });
    });
  },
};

module.exports = Post;
