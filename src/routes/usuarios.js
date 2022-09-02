const router = require("express").Router();
const User = require('../model/Usuario');
const Anuncio = require('../model/Anuncio');
const Reserva = require('../model/Reserva');
const autorizacao = require("../middleware/verificarToken");
const validarInfo = require('../middleware/validarInfo');
const geradorToken = require('../utils/geradorToken');
const bcrypt = require('bcrypt');

router.get("/", async (req, res) => {
    try {
        const usuarios = await User.find()
        res.status(200).json({result: usuarios, message: null, success: true});
    } catch (err) {
        res.status(500).json({result: err, message: 'Erro ao pesquisar usuários. Por favor tente novamente.', success: false});
    }
})

router.get("/:id", async (req, res) => {
    const id = req.params['id'];
    try {
        const usuario = await User.findById(id).exec();
        res.status(200).json({result: usuario, message: null, success: true});
    } catch (err) {
        res.status(500).json({result: err, message: 'Usuário não encontrado.', success: false});
    }
})

router.post("/registrar",validarInfo, async (req, res) => {
    const { nome, email, senha, contato } = req.body

    const user = await User.find({ email: email }).exec();
    if (user.length !== 0) {
        return res.status(401).json({result: null, message: 'Já existe um usuário utilizando este e-mail.', success: false})
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(senha, salt);

    const usuario = new User({
        nome: nome,
        email: email,
        senha: hashedPassword,
        contato: contato
    });

    usuario.save().then(data => {
        const token = geradorToken(data.id);
        res.status(200).json({result: token, message: 'Usuário criado com sucesso.', success: true});
    })
    .catch(err => res.status(500).json({result: err, message: 'Erro ao criar usuário. Por favor, tente novamente.', success: false}));
})

router.post("/entrar",validarInfo, async (req, res) => {
    const { email, senha } = req.body

    const user = await User.find({ email: email }).exec();
    if (user.length === 0) {
        return res.status(401).json({result: null, message: 'E-mail ou senha incorretos.', success: false})
    }

    const senhaValida = await bcrypt.compare(senha, user[0].senha)

    if (!senhaValida) {
        return res.status(401).json({result: null, message: 'E-mail ou senha incorretos.', success: false})
    }

    const token = geradorToken(user[0].id);
    res.status(200).json({result: token, message: 'Usuário logado com sucesso.', success: true});
})

router.delete("/excluir",autorizacao, async (req, res) => {
    const id = req.id;
    try {
        const usuario = await User.findById(id).exec();

        if(usuario.id === req.id) {
            await usuario.deleteOne();
            await Anuncio.deleteMany({id_anunciante: id}).exec();
            await Reserva.deleteMany({id_usuario: id}).exec();
            return res.status(200).json({result: null, message: 'Usuário excluído com sucesso.', success: true});
        }

        res.status(401).json({result: null, message: 'Somente o anunciante pode excluir o próprio anúncio.', success: false});
    } catch (err) {
        res.status(500).json({result: err, message: 'Anúncio não encontrado.', success: false});
    }
})

module.exports = router;