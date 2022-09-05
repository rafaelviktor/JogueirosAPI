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

        res.status(200).json("Imagem excluída com sucesso")
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Internal server error")
    }
});

module.exports = router;