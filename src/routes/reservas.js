const router = require("express").Router();
const Anuncio = require('../model/Anuncio');
const Reserva = require('../model/Reserva');
const autorizacao = require("../middleware/verificarToken");

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
        const reserva = await Reserva.findById(id).exec();
        res.status(200).json({result: reserva, message: null, success: true});
    } catch (err) {
        res.status(500).json({result: err, message: 'Reserva não encontrada.', success: false});
    }
})

router.post("/criar",autorizacao, async (req, res) => {
    const configdata = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }

    const reserva = new Reserva({
        id_usuario: req.id,
        id_anuncio: req.body.id_anuncio,
        data_reserva: req.body.data_reserva,
        hora_inicio: req.body.hora_inicio,
        hora_final: req.body.hora_final,
        data_inclusao: new Date().toLocaleDateString('pt-br', configdata),
        status: "Pendente"
    });

    reserva.save().then(data => {
        res.status(200).json({result: null, message: data, success: true});
    })
    .catch(err => res.status(500).json({result: err, message: 'Erro ao realizar a reserva. Por favor, tente novamente.', success: false}));
})

router.patch("/alterar/:id",autorizacao, async (req, res) => {
    const id = req.params['id'];
    try {
        const reserva = await Reserva.findById(id).exec();

        if(reserva.id_usuario === req.id) {
            Object.assign(req.body, {status: "Pendente"});
            Object.assign(reserva, req.body);
            reserva.save();
            return res.status(200).json({result: reserva, message: 'Reserva alterada com sucesso.', success: true});
        }

        res.status(401).json({result: null, message: 'Somente o usuário que criou a reserva pode modificá-la.', success: false});
    } catch (err) {
        res.status(500).json({result: err, message: 'Erro ao alterar a reserva. Por favor, tente novamente.', success: false});
    }
})

router.delete("/excluir/:id",autorizacao, async (req, res) => {
    const id = req.params['id'];
    try {
        const reserva = await Reserva.findById(id).exec();
        const anuncio = await Anuncio.findById(reserva.id_anuncio).exec();

        if(reserva.id_usuario === req.id || anuncio.id_anunciante === req.id) {
            reserva.deleteOne();
            return res.status(200).json({result: null, message: 'Reserva excluída com sucesso.', success: true});
        }

        res.status(401).json({result: null, message: 'Somente o anunciante ou o usuário que fez a reserva podem excluí-la.', success: false});
    } catch (err) {
        res.status(500).json({result: err, message: 'Reserva não encontrada.', success: false});
    }
})

module.exports = router;