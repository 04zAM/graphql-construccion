const { db } = require("./cnn")

const pizzaResolver={
    Query:{
        pizzas(root,nameFind){
            return db.any('select * from pizza order by piz_id desc')
        }
    }
}

module.exports=pizzaResolver


