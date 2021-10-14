const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (app) => {

    //Listar Usuários
    app.get("/", (req, res) => {
        User.find({}, (err, users) => {
            if (err) {
                res.status(500).send(err);
            }
            res.json(
                users.map((user) => {
                    return { id: user.id, name: user.name, email: user.email };
                })
            );
        });
    });

    //Registrar Usuários
    app.post("/register", (req, res) => {
        let newUser = new User(req.body);
        newUser.password = bcrypt.hashSync(req.body.password, 10);
        newUser.save((err, user) => {
            if (err) {
                res.send(err);
            }
            res.status(201).json(newUser);
        })
    });

    //Atualizar Usuário
    app.put("/:id", (req, res) => {
        const id = req.params.id;
        const userUpdate = req.body;
        if (req.body.password) {
            userUpdate.password = bcrypt.hashSync(req.body.password, 10);
        }

        User.findByIdAndUpdate(id, userUpdate, { new: true }, (err, userUpdated) => {
            if (err) {
                res.status(500).send(err);
            }
            if (userUpdated) {
                res.json(userUpdated);
            }
            else {
                res.status(404).json({ error: "Usuário não encontrado" });
            }
        });
    });

    //Deletar Usuário
    app.delete("/:id", (req, res) => {
        const id = req.params.id;
        User.findByIdAndDelete(id, (err, userDeleted) => {
            if (err) {
                res.status(500).send(err);
            }
            if (userDeleted) {
                res.json(userDeleted);
            }
            else {
                res.status(404).json({ erro: "Usuário não encontrado" });
            }
        });
    });

    //Verifica o Login
    app.post("/login", (req, res) => {
        if (req.body && req.body.name && req.body.password) {
            const userName = req.body.name;
            const UserPassword = req.body.password;

            User.findOne({ name: userName }, (err, user) => {
                if (err) {
                    res.status(500).send(err);
                }

                if (user && bcrypt.compareSync(UserPassword, user.password)) {
                    const token = jwt.sign({
                        id: user.id
                    }, 'Sen@crs', { expiresIn: "1h" });
                    res.status(201).json({ token: token });
                }
                else {
                    res.status(401).json({ erro: "Usuário ou senha inválidos" });
                }
            });
        }
        else {
            res.status(401).json({ erro: "Usuário ou senha inválidos" });
        }
    });
};
