import express from 'express';
import multer from 'multer';
import {jwthandler} from "./JWThandler";

import {CustomerSupportModel} from '../models/support-request.model';
import {AttachmentModel} from '../models/attachment.model';

const router = express.Router();

const upload = multer({dest: 'uploads/attachments/'});

router.post('', upload.single('attachment') , async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let title = req.body.title;
    let description = req.body.description;
    let tel = req.body.tel;
    let company = req.body.company;

    if (name && email && title && description) {
        let file = req.file ? req.file : '';

        let csm;

        if ( file ) {
            let att = await AttachmentModel.create({
                originalName: file.originalname,
                encode: file.encoding,
                mimeType: file.mimetype,
                destination: file.destination,
                filename: file.filename,
                size: file.size
            });

            csm =  CustomerSupportModel.create({
                    name,
                    email,
                    title,
                    description,
                    tel,
                    company,
                    attachment: att._id
                }
            );
        } else {
            csm =  CustomerSupportModel.create({
                    name,
                    email,
                    title,
                    description,
                    tel,
                    company
                }
            );
        }
        csm.then(doc => {res.json(doc)}, err => {res.json(err)});
    } else {
        res.json({
            error: 'Missing arguments',
            name,
            email,
            title,
            description
        })
    }
});

router.get('/', jwthandler, (req, res) => {
    CustomerSupportModel.find({}).populate({
        path: 'attachment',
        model: 'Attachment'
    }).then(docs => res.json(docs)).catch(err => res.json(err));
});

export default router;
