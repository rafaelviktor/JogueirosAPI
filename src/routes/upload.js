const router = require("express").Router();
const fs = require('fs');
const autorizacao = require("../middleware/verificarToken");
const imageController = require("../controllers/image-controller");
const imageUploader = require("../controllers/image-uploader");

router.post('/', imageUploader.upload.single('image'), imageController.upload);

router.delete('/excluir/:img', autorizacao, async (req, res) => {
    try {
        const uploadsPath = `./public/uploads/${req.params['img']}`; 
        fs.unlinkSync(uploadsPath);

        res.status(200).json({result: null, message: 'Imagem excluída com sucesso.', success: true})
    } catch (err) {
        res.status(500).send({result: err.message, message: 'Erro ao tentar excluir imagem, por favor tente novamente.', success: false})
    }
});

module.exports = router;