const router = require("express").Router();
const Anuncio = require('../model/Anuncio');

router.get("/", async (req, res) => {
    try {
        const anuncios = await Anuncio.find()
        res.status(200).json({result: anuncios, message: null, success: true});
    } catch (err) {
        res.status(500).json({result: null, message: err, success: false});
    }
})

router.post("/create", async (req, res) => {
    const anuncio = new Anuncio({
        id_anunciante: req.body.id_anunciante,
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        preco: req.body.preco,
        imagem: req.body.imagem,
        cep: req.body.cep,
        logradouro: req.body.logradouro,
        numero: req.body.numero,
        complemento: req.body.complemento,
        bairro: req.body.bairro,
        cidade: req.body.cidade,
        estado: req.body.estado,
        visualizacoes: 0
    });

    anuncio.save().then(data => {
        res.status(200).json({result: null, message: data, success: true});
    })
    .catch(err => res.status(500).json({result: null, message: err, success: false}));
})

module.exports = router;