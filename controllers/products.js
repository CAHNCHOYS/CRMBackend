import { pool } from "../database/index.js";

export const getAllUserProducts = (req, res) => {
  const user_id = req.params.user_id;
  console.log(user_id);

  const q = `SELECT products.id, products.name, products.price, products.count, products.user_id, categories.name as category, categories.id as categoryId
  FROM ((products    INNER JOIN categories ON categories.id = products.category_id) 
  INNER JOIN users ON users.id = products.user_id)  WHERE products.user_id = ${+user_id}`;

  pool.query(q, (error, results) => {
    if (!error) {
      console.log(results);
      res.json({ data: results });
    } else {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
};

export const deleteProduct = (req, res) => {
  const product_id = req.params.product_id;

  console.log(product_id);
  pool.query(
    `DELETE FROM products WHERE products.id = ${+product_id}`,
    (error, results) => {
      if (!error) {
        res.json({ isProductDeleted: true });
      } else {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    }
  );
};

export const getProductsCategories = (req, res) => {
  console.log("I am called");
  pool.query("SELECT * from categories", (error, results) => {
    if (!error) {
      res.json({ data: results });
    } else {
      res.status(500).json({ error: error.message });
    }
  });
};

export const updateUserProduct = (req, res) => {
  const { name, categoryId, count, price, productId, userId } = req.body;

  console.log(categoryId);
  pool.query(
    `UPDATE products SET name = '${name}', price = ${+price}, count = ${+count}, category_id = ${+categoryId}
          WHERE products.id = ${+productId}`,
    (error, results) => {
      if (!error) {
        const q = `SELECT products.id, products.name, products.price, products.count, products.user_id, categories.name as category, categories.id as categoryId
        FROM ((products    INNER JOIN categories ON categories.id = products.category_id) 
        INNER JOIN users ON users.id = products.user_id)  WHERE products.user_id = ${+userId} AND products.name = '${name}' AND products.count = ${+count}`;

        pool.query(q, (error, results) => {
          if (!error) {
            res.json({ data: results[0] });
          } else {
            console.log(error);
            res.status(500).json({ error: error.message });
          }
        });
      } else {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    }
  );
};

export const addUserProduct = (req, res) => {
  const { name, price, categoryId, userId, count } = req.body;
  pool.query(
    `INSERT INTO products (name, price, category_id, user_id, count) 
   VALUES ('${name}', '${+price}', '${+categoryId}', '${+userId}', '${+count}')`,
    (error, results) => {
      if (!error) {
        const q = `SELECT products.id, products.name, products.price, products.count, products.user_id, categories.name as category, categories.id as categoryId
          FROM ((products    INNER JOIN categories ON categories.id = products.category_id) 
          INNER JOIN users ON users.id = products.user_id)  WHERE products.user_id = ${+userId} AND products.name = '${name}' AND products.count = ${+count}`;

        pool.query(q, (error, results) => {
          if (!error) {
            res.json({ data: results[0] });
          } else {
            console.log(error);
            res.status(500).json({ error: error.message });
          }
        });
      } else {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    }
  );
};


