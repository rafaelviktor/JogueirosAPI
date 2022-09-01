module.exports = (req, res, next) => {
    const { email, nome, senha } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
  
    if (req.path === "/registrar") {
      if (![email, nome, senha].every(Boolean)) {
        return res.status(401).json({result: null, message: "Por favor preencha os campos.", success: false});
      } else if (!validEmail(email)) {
        return res.status(401).json({result: null, message: "E-Mail inválido.", success: false});
      }

    } else if (req.path === "/entrar") {
      if (![email, senha].every(Boolean)) {
        return res.status(401).json({result: null, message: "Por favor preencha os campos.", success: false});
      } else if (!validEmail(email)) {
        return res.json({result: null, message: "E-Mail inválido.", success: false});
      }
    }
  
    next();
  };