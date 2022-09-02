const router = require("express").Router();
const User = require('../model/Usuario');
const Anuncio = require('../model/Anuncio');
const Reserva = require('../model/Reserva');
const autorizacao = require("../middleware/verificarToken");

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
        res.status(200).json({result: reservas, message: null, success: true});
    } catch (err) {
        res.status(500).json({result: err, message: 'Erro ao pesquisar reservas. Por favor tente novamente.', success: false});
    }
})

module.exports = router;