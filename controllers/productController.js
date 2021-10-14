const Product = require("../models/product");

module.exports = (app) => {

    //Listar Produtos
    app.get("/products", (req, res) => {
        Product.find({}, (err, prod) => {
            if (err) {
                res.status(500).send(err);
            }
            res.json(
                prod.map((prod) => {
                    return { id: prod.id, name: prod.name, price: prod.price, qt: prod.qt };
                })
            );
        });
    });

    //Registrar Produtos
    app.post("/registerProduct", (req, res) => {
        let newProd = new Product(req.body);
        newProd.save((err, prod) => {
            if (err) {
                res.send(err);
            }
            res.status(201).json(newProd);
        })
    });

    //Atualizar Produtos
    app.put("/products/:id", (req, res) => {
        const id = req.params.id;
        const productUpdate = req.body;

        Product.findByIdAndUpdate(id, productUpdate, { new: true }, (err, productUpdated) => {
            if (err) {
                res.status(500).send(err);
            }
            if (productUpdated) {
                res.json(productUpdated);
            }
            else {
                res.status(404).json({ error: "Produto não encontrado" });
            }
        });
    });

    //Deletar Produtos
    app.delete("/products/:id", (req, res) => {
        const id = req.params.id;
        Product.findByIdAndDelete(id, (err, productDeleted) => {
            if (err) {
                res.status(500).send(err);
            }
            if (productDeleted) {
                res.json(productDeleted);
            }
            else {
                res.status(404).json({ erro: "Produto não encontrado" });
            }
        });
    });
};