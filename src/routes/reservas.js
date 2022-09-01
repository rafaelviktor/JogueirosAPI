const router = require("express").Router();
const Reserva = require('../model/Reserva');

router.get("/", async (req, res) => {
    try {
        const reservas = await Reserva.find()
        res.status(200).json({result: reservas, message: null, success: true});
    } catch (err) {
        res.status(500).json({result: err, message: 'Erro ao pesquisar reservas. Por favor tente novamente.', success: false});
    }
})

router.get("/:id", async (req, res) => {
    const id = req.params['id'];
    try {
        const anuncios = await Reserva.find({ _id: id }).exec();
        res.status(200).json({result: anuncios[0], message: null, success: true});
    } catch (err) {
        res.status(500).json({result: err, message: 'Reserva não encontrada.', success: false});
    }
})

router.post("/create", async (req, res) => {
    const configdata = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }

    const reserva = new Reserva({
        id_usuario: req.body.id_usuario,
        id_anuncio: req.body.id_anuncio,
        data_reserva: req.body.data_reserva,
        hora_inicio: req.body.hora_inicio,
        hora_final: req.body.hora_final,
        data_inclusao: new Date().toLocaleDateString('pt-br', configdata)
    });

    reserva.save().then(data => {
        res.status(200).json({result: null, message: data, success: true});
    })
    .catch(err => res.status(500).json({result: err, message: 'Erro ao realizar a reserva. Por favor, tente novamente.', success: false}));
})

module.exports = router;