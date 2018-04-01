import * as express from 'express';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import {SECRET} from '../config/setup';

import {UserModel} from '../models/user.model';

const router = express.Router();

router.post('', (req, res) => {

    UserModel.findOne({username: req.body.username}).then(async user => {
        if(user && user.password === md5(req.body.password + user.salt)) {

            const payload = {
                username: user.username
            };

            //let token = await jwt.sign(payload, SECRET, {expiresInMinutes: 5});

            //console.log(token);

            res.json({
                success: true,
                message: 'Authentication Successful!',
                token: jwt.sign(payload, SECRET, {expiresIn: 300})
            })
        } else {
            res.json({success: false, message: "Authentication failed!"});
        }
    }).catch(err => res.json(err));

});

router.get('', (req, res) => {
    UserModel.find({}, 'username').then((doc) => res.json(doc)).catch((err) => res.json(err));
});

router.get('/setup', async  (req, res) => {

    let theAdmin  = new UserModel({
        username: 'admin',
        password: 'seoulgroupkorea123'
    }).save();

    theAdmin.then((user) => res.json(user)).catch((error) => res.json(error));

    console.log('Created The Admin User');

});

export default router;
