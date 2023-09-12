const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Products = require("./models/product");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
    .connect(
        "mongodb+srv://2021anketkadam:darashmishra@cluster0.feviwo2.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, dbName: "farm" }
    )
    .then(() => {
        console.log("connection is ready!!");
    })
    .catch((e) => {
        console.log(e);
    });

app.get("/products", async(req, res) => {
    const products = await Products.find();
    res.send(products);
});

app.post("/products", async(req, res) => {
    console.log(req.body);
    const product = new Products({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
    });
    try {
        const newProduct = await product.save();
        res.status(200).send(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error saving product.");
    }
});

app.put("/products/:id", async(req, res) => {
    const foundProduct = await Products.findByIdAndUpdate(
        req.params.id, {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
        }, { new: true }
    );
    const product = await foundProduct.save();
    res.send(product);
});

app.delete("/products/:id", async(req, res) => {
    const toDelete = await Products.findByIdAndRemove(req.params.id);
    if (toDelete) {
        res.send(toDelete);
    } else {
        res.send("not removed soryy ");
    }
});

app.listen(3000, () => {
    console.log("listening on port no 3000");
});