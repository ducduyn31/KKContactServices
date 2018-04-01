import jwt from 'jsonwebtoken';
import {SECRET} from '../config/setup';

const theHandler = (req, res, next) => {
    let token = req.body.token || req.query.token || req.header['x-access-token'];

    if (token) {
        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {return res.json({success: false, message: 'Failed to authenticate token.'})}

            req.decoded = decoded;
            next();
        });
    } else {
        return res.status(403).json({success: false, message: 'No token provided'});
    }
};

export {theHandler as jwthandler};
