import * as express from 'express';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import {DefaultAdmin, SECRET} from '../config/setup';

import {UserModel} from '../models/user.model';
import {jwthandler} from "./JWThandler";

const router = express.Router();

router.post('', (req, res) => {
    UserModel.findOne({username: req.body.username}).then(async user => {
        if(user && user.password === md5(req.body.password + user.salt)) {

            const payload = {
                username: user.username
            };

            res.json({
                success: true,
                message: 'Authentication Successful!',
                token: jwt.sign(payload, SECRET, {expiresIn: 3600})
            })
        } else {
            res.json({success: false, message: "Authentication failed!"});
        }
    }).catch(err => res.json(err));

});

router.get('', jwthandler, (req, res) => {
    UserModel.find({}, 'username').then((doc) => res.json(doc)).catch((err) => res.json(err));
});

router.post('/verify', (req, res) => {
    let verifyToken = req.query.token;

    jwt.verify(verifyToken, SECRET, (err, decoded) => {
        if (err) {return res.json(err);}

        res.json({success: true});
    })
});

router.get('/setup', async  (req, res) => {

    UserModel.count({username: 'admin'}).then((count) => {
        if (count === 0) {
            let theAdmin  = new UserModel(DefaultAdmin).save();

            theAdmin.then(() => {res.json({success: true, default_detail: {username: DefaultAdmin.username, password: DefaultAdmin.password}})}).catch((error) => res.json(error));

            console.log('Created The Admin User');
        } else {
            res.json({success: false});
        }
    }).catch(err => {res.json(err)});

});

export default router;
