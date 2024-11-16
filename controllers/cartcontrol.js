const product = require("../models/product");

const count={};
    const addedItems = [req.params.id];
    addedItems.forEach(item => {
        count[item] = 0;
    });
    user.cart.forEach(product =>{
        if(addedItems.includes(product)){
            count[product]++;
        }
    })

    module.exports = count;