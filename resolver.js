const { db } = require("./cnn");

const pizzaResolver = {
  Query: {
    async pizzas(root, { name }) {
      if (name == undefined) {
        return await db.any("select * from pizza order by id desc");
      } else {
        return await db.any(`select * from pizza where name=$1`, [name]);
      }
    },
  },
  pizza: {
    async ingredients(pizza) {
      return await db.any(
        `SELECT i.* FROM ingredient i INNER JOIN pizza_ingredients pi ON pi.ingredient_id=i.id 
        WHERE pi.pizza_id=$1`,
        [pizza.id]
      );
    },
  },
  Mutation: {
    async createPizza(root, { pizza }) {
      if (pizza == undefined) {
        return null;
      } else {
        const pizza_sql = await db.one(
          `INSERT INTO pizza(name, origin, state)
          VALUES($1,$2,true) returning *;`,
          [pizza.name, pizza.origin]
        );
        if (pizza.ingredients && pizza.ingredients.length !== 0) {
          pizza.ingredients.forEach((ingredient) => {
            db.one(
              `INSERT INTO pizza_ingredients (pizza_id, ingredient_id)
            VALUES($1, $2)`,
              [pizza_sql.id, ingredient]
            );
          });
        }
        return pizza_sql;
      }
    },
    async updatePizza(root, { pizza }) {
      if (pizza == undefined) {
        return null;
      } else {
        const pizza_sql = await db.one(
          `UPDATE pizza SET name=$1, origin=$2 where id=$3 returning *;`,
          [pizza.name, pizza.origin, pizza.id]
        );
        if (pizza.ingredients && pizza.ingredients.length !== 0) {
          pizza.ingredients.forEach((ingredient) => {
            db.one(
              `UPDATE pizza_ingredients SET ingredient_id=$1 where pizza_id=$2;`,
              [ingredient, pizza_sql.id]
            );
          });
        }
        return pizza_sql;
      }
    },
    async deletePizza(root, { pizza }) {
      if (pizza == undefined) {
        return null;
      } else {
        return await db.one(
          `UPDATE pizza SET state=false where id=$1 returning *;`,
          [pizza.id]
        );
      }
    },
  },
};

module.exports = pizzaResolver;
