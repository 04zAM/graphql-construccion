const { db } = require("./cnn");

const pizzaResolver = {
  Query: {
    async pizza(root, { name }) {
      if (name == undefined) {
        return await db.any("select * from pizza order by piz_id desc");
      } else {
        return await db.any(
          `if (pizza == undefined) {
            return null;
        } else {
            
        } select * from pizza where piz_name=$1`,
          [name]
        );
      }
    },
  },
  pizza: {
    async ingredient(pizza) {
      return await db.any(
        `SELECT i.* FROM ingredients i INNER JOIN pizza_ingredient pi
        USING(ing_id) WHERE pii.piz_id=$1`,
        [pizza.piz_id]
      );
    },
  },
  Mutation: {
    createPizza(root, { pizza }) {
      if (pizza == undefined) {
        return null;
      } else {
        return await db.any(
          `INSERT INTO pizza(piz_name, piz_origin, piz_state)
          VALUES($1,$2,$3) returnig*;`,
          [pizza.piz_name, pizza.piz_origin, pizza.piz_state]
        );
      }
    },
  },
};

module.exports = pizzaResolver;
