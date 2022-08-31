const router = require("express").Router();
const User = require('../model/Usuarios');
const bcrypt = require('bcrypt');

router.get("/", async (req, res) => {
    try {
        const usuarios = await User.find().limit(5)
        res.status(200).json({result: usuarios, message: null, success: true});
    } catch (err) {
        res.status(500).json({result: null, message: err, success: false});
    }
})

router.post("/create", async (req, res) => {
    // encriptar a senha
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const usuario = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });

    usuario.save().then(data => {
        res.status(200).json({result: null, message: data, success: true});
    })
    .catch(err => res.status(500).json({result: null, message: err, success: false}));
})

module.exports = router;