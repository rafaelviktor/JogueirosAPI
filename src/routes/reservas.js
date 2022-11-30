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

    const dataHoje = new Date()
    dataHoje.setHours(dataHoje.getHours() - 3)

    const reserva = new Reserva({
        id_usuario: req.id,
        id_anuncio: req.body.id_anuncio,
        data_reserva: req.body.data_reserva,
        hora_inicio: req.body.hora_inicio,
        hora_final: req.body.hora_final,
        data_inclusao: dataHoje.toLocaleDateString('pt-br', configdata),
        status: "Pendente"
    });

    reserva.save().then(data => {
        res.status(200).json({result: data, message: 'Reserva efetuada com sucesso.', success: true});
    })
    .catch(err => res.status(500).json({result: err, message: 'Erro ao realizar a reserva. Por favor, tente novamente.', success: false}));
})

router.patch("/alterar/:id",autorizacao, async (req, res) => {
    const id = req.params['id'];
    try {
        const reserva = await Reserva.findById(id).exec();

        if(reserva.id_usuario === req.id) {
            if(reserva.status === "Recusado") {
                return res.status(403).json({result: null, message: 'A reserva foi recusada, portanto não pode ser editada, apenas excluída.', success: false});
            }

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

router.patch("/status/:id/:status",autorizacao, async (req, res) => {
    const id = req.params['id'];
    const status = req.params['status'];
    try {
        const reserva = await Reserva.findById(id).exec();
        const anuncio = await Anuncio.findById(reserva.id_anuncio).exec();

        if(anuncio.id_anunciante === req.id) {
            Object.assign(reserva, {status: status});
            reserva.save();
            return res.status(200).json({result: reserva, message: 'Status da reserva alterado com sucesso.', success: true});
        }

        res.status(401).json({result: null, message: 'Somente o dono do anúncio pode modificar a reserva.', success: false});
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