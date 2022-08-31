const router = require("express").Router();
const Reserva = require('../model/Reserva');

router.get("/", async (req, res) => {
    try {
        const reservas = await Reserva.find()
        res.status(200).json({result: reservas, message: null, success: true});
    } catch (err) {
        res.status(500).json({result: null, message: err, success: false});
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
    .catch(err => res.status(500).json({result: null, message: err, success: false}));
})

module.exports = router;