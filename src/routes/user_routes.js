const express = require('express');
const UserRepository = require('../database/repository/user');

const bcrypt = require('bcrypt');
const saltRounds = 12;

const router = express.Router();
const uRepo = new UserRepository();

//buscar todos os usuarios
router.get('/', async (_, res) => {
    let resp = {
        status: 'OK',
        data: await uRepo.findAll(),
    }
    res.status(200).json(resp);
  });
  //busca usuario com id especificado
router.get('/:id', async (req, res) => {
  
    let id = req.params["id"];
  
    let user = await uRepo.findById(id);

    if (user.length > 0) {
        let resp = {
            status: 'OK',
            data: user[0],
        };
        res.status(200).json(resp);
    } else {
        let resp = {
            status: 'ERROR',
            description: `User with id ${id} was not found.`,
        };
        res.status(404).json(resp);
    }
});
  //cadastrar novo usuario
router.post('/', async (req, res) => {
    let u = req.body;

    if (u.user_name == undefined || u.user_email == undefined) {
        let resp = {
            status: 'ERROR',
            description: `User JSON with id, nome and email must be provided.`
        }
        res.status(400).json(resp);

    } else {
        let user = await uRepo.insert(u);
  
    let resp = {
        status: 'OK',
        data: `User with id ${user.id} inserted with success.`
    }
  
    res.status(200).json(resp);
    }
  });
  //atualiza usuario com id especificado
router.put('/:id', async (req, res) => {
  
    let id = req.params["id"];
    let u = req.body;

    let user = await uRepo.findById(id);

    if (user.length > 0) {
        if (u.nome == undefined || u.email == undefined) {
            let resp = {
                status: 'ERROR',
                description: `User JSON with id, nome and email must be provided.`
            }
            res.status(400).json(resp);
        }

        user = await uRepo.update(id, u);

        let resp = {
            status: 'OK',
            data: `User with id ${id} updated with success.`
        }

        res.status(200).json(resp);
    } else {
        let resp = {
            status: 'ERROR',
            description: `User with id ${id} was not found.`
        }

        res.status(404).json(resp);
    }
  });
  //deleta usuario com id especificado
  router.delete('/:id', async (req, res) => {
  
    let id = req.params["id"];
    let user = await uRepo.findById(id);

    if (user.length > 0) {
        if (user == undefined) {
            let resp = {
                status: 'ERROR',
                description: `This user was not found.`
            }
            res.status(404).json(resp);
        }
  
        await uRepo.delete(user[0]);

        let resp = {
            status: 'OK',
            data: `User with id ${id} deleted with success.`
        }
        res.status(200).json(resp);
    } else {
        let resp = {
            status: 'ERROR',
            description: `User with id ${id} was not found.`
        }
        res.status(404).json(resp);
    }
  });

module.exports = router