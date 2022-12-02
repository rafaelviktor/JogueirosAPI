const router = require("express").Router();
const User = require('../model/Usuario');
const Anuncio = require('../model/Anuncio');
const Reserva = require('../model/Reserva');
const autorizacao = require("../middleware/verificarToken");
const bcrypt = require('bcrypt');

router.get("/",autorizacao, async (req, res) => {
    try {
        const usuario = await User.findById(req.id).exec();
        res.status(200).json({result: usuario, message: null, success: true});
    } catch (err) {
        res.status(500).json({result: err, message: 'Erro ao acessar perfil. Por favor tente novamente.', success: false});
    }
})

router.get("/meus-anuncios",autorizacao, async (req, res) => {
    try {
        const anuncios = await Anuncio.find({ id_anunciante: req.id }).exec();
        res.status(200).json({result: anuncios, message: null, success: true});
    } catch (err) {
        res.status(500).json({result: err, message: 'Erro ao pesquisar anúncios. Por favor tente novamente.', success: false});
    }
})

router.get("/minhas-reservas",autorizacao, async (req, res) => {
    try {
        const reservas = await Reserva.find({ id_usuario: req.id }).exec();
        const resultado = []
        for(i = 0; i < reservas.length; i++) {
            resultado.push(reservas[i], await Anuncio.findById(reservas[i].id_anuncio).exec())
        }
        res.status(200).json({result: resultado, message: null, success: true});
    } catch (err) {
        res.status(500).json({result: err, message: 'Erro ao pesquisar reservas. Por favor tente novamente.', success: false});
    }
})

router.patch("/alterar/:id",autorizacao, async (req, res) => {
    const id = req.params['id'];
    try {
        const usuario = await User.findById(id).exec();

        if(usuario.id === req.id) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.senha, salt);
            Object.assign(usuario,
                req.body.nome === "" ? null : {nome: req.body.nome},
                req.body.email === "" ? null : {email: req.body.email},
                req.body.senha === "" ? null : {senha: hashedPassword},
                req.body.contato === "" ? null : {contato: req.body.contato}
            );
            usuario.save();
            return res.status(200).json({result: usuario, message: 'Usuário alterado com sucesso.', success: true});
        }

        res.status(401).json({result: null, message: 'O usuário logado só pode alterar dados da própria conta.', success: false});
    } catch (err) {
        res.status(500).json({result: err, message: 'Erro ao alterar o usuário. Por favor, tente novamente.', success: false});
    }
})

router.delete("/excluir/:id",autorizacao, async (req, res) => {
    const id = req.params['id'];
    try {
        const usuario = await User.findById(id).exec();

        if(usuario.id === req.id) {
            await usuario.deleteOne();
            await Anuncio.deleteMany({id_anunciante: id}).exec();
            await Reserva.deleteMany({id_usuario: id}).exec();
            return res.status(200).json({result: null, message: 'Usuário excluído com sucesso.', success: true});
        }

        res.status(401).json({result: null, message: 'O usuário logado só pode excluir a própria conta.', success: false});
    } catch (err) {
        res.status(500).json({result: err, message: 'Usuário não encontrado.', success: false});
    }
})

module.exports = router;