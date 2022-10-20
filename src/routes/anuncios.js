const router = require("express").Router();
const Anuncio = require('../model/Anuncio');
const Reserva = require('../model/Reserva');
const autorizacao = require("../middleware/verificarToken");
const fs = require('fs');
const path = require('path');

router.get("/", async (req, res) => {
    try {
        const anuncios = await Anuncio.find().sort({ _id: -1 });
        res.status(200).json({result: anuncios, message: null, success: true});
    } catch (err) {
        res.status(500).json({result: err, message: 'Erro ao pesquisar anúncios. Por favor tente novamente.', success: false});
    }
})

router.get("/populares", async (req, res) => {
    try {
        const anuncios = await Anuncio.find().sort({ visualizacoes: 'desc' });
        res.status(200).json({result: anuncios, message: null, success: true});
    } catch (err) {
        res.status(500).json({result: err, message: 'Erro ao pesquisar anúncios. Por favor tente novamente.', success: false});
    }
})

router.get("/pesquisa", async (req, res) => {
    try {
        const { q } = req.query
        const anuncios = await Anuncio.find({tituloformatado: { $regex: '.*' + q.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + '.*', $options: 'i' }}).exec();
        res.status(200).json({result: anuncios, message: null, success: true});
    } catch (err) {
        res.status(500).json({result: err, message: 'Erro ao pesquisar anúncios. Por favor tente novamente.', success: false});
    }
})

router.get("/pesquisa/estado/:uf", async (req, res) => {
    const uf = req.params["uf"]
    try {
        const { q } = req.query
        const anuncios = await Anuncio.find({estado: { $regex: '.*' + uf + '.*', $options: 'i' }}).exec();
        res.status(200).json({result: anuncios, message: null, success: true});
    } catch (err) {
        res.status(500).json({result: err, message: 'Erro ao pesquisar anúncios. Por favor tente novamente.', success: false});
    }
})

router.get("/:id", async (req, res) => {
    const id = req.params['id'];
    try {
        const anuncio = await Anuncio.findByIdAndUpdate(id, {  $inc: { visualizacoes: 1 }  }).exec();
        res.status(200).json({result: anuncio, message: null, success: true});
    } catch (err) {
        res.status(500).json({result: err, message: 'Anúncio não encontrado.', success: false});
    }
})

router.post("/criar",autorizacao, async (req, res) => {
    const tituloformatado = req.body.titulo;

    const anuncio = new Anuncio({
        id_anunciante: req.id,
        titulo: req.body.titulo,
        tituloformatado: tituloformatado.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
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
        res.status(200).json({result: data, message: 'Anúncio criado com sucesso.', success: true});
    })
    .catch(err => res.status(500).json({result: err, message: 'Erro ao criar anúncio. Por favor, tente novamente.', success: false}));
})

router.patch("/alterar/:id",autorizacao, async (req, res) => {
    const id = req.params['id'];
    try {
        const anuncio = await Anuncio.findById(id).exec();

        if(anuncio.id_anunciante === req.id) {
            Object.assign(anuncio, req.body);
            anuncio.save();
            return res.status(200).json({result: anuncio, message: 'Anúncio alterado com sucesso.', success: true});
        }

        res.status(401).json({result: null, message: 'Somente o anunciante pode alterar o próprio anúncio.', success: false});
    } catch (err) {
        res.status(500).json({result: err, message: 'Erro ao alterar o anúncio. Por favor, tente novamente.', success: false});
    }
})

router.delete("/excluir/:id",autorizacao, async (req, res) => {
    const id = req.params['id'];
    try {
        const anuncio = await Anuncio.findById(id).exec();

        if(anuncio.id_anunciante === req.id) {
            await anuncio.deleteOne();
            await Reserva.deleteMany({id_anuncio: id}).exec();
            return res.status(200).json({result: null, message: 'Anúncio excluído com sucesso.', success: true});
        }

        res.status(401).json({result: null, message: 'Somente o anunciante pode excluir o próprio anúncio.', success: false});
    } catch (err) {
        res.status(500).json({result: err, message: 'Erro ao excluir o anúncio. Por favor, tente novamente.', success: false});
    }
})

module.exports = router;