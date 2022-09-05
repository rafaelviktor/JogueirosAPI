function upload(req, res) {
    if(req.file.filename) {
        res.status(201).json({result: {url: req.file.filename}, message: 'Upload de imagem realizado com sucesso.', success: true})
    } else {
        res.status(500).json({result: null, message: 'Erro interno do servidor ao tentar enviar a imagem.', success: false})
    }
}

module.exports = {
    upload: upload
}