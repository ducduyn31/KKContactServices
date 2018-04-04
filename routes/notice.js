import express from 'express';
import {ObjectId} from 'mongoose/lib/types';
import {jwthandler} from './JWThandler';

import {NoticeModel} from '../models/contact.model';

const router = express.Router();

router.get('', async (req, res) => {
    let allNotices = NoticeModel.find({}, 'subject author view');
    allNotices.exec((err, docs) => {
        if (err) res.json(err);
        docs = docs.map(
            doc => {
                return {
                    _id: doc['_id'],
                    subject: doc['subject'],
                    author: doc['author'],
                    date: ObjectId(doc['_id']).getTimestamp(),
                    view: doc['view']
                }
            }
        );
        res.json(docs);
    });
});

router.get('/getContent/:id', async (req, res) => {
    let content = NoticeModel.findOne({_id: req.params.id});
    content.exec((err, doc) => {
        let view = doc.view;
        doc.view = ++view;
        doc.save();
        res.json(doc.rawContent);
    })
});

router.get('/getNoticeAsAdmin/:id', jwthandler, async (req, res) => {
    let content = NoticeModel.findOne({_id: req.params.id});
    content.exec((err, doc) => {
        let view = doc.view;
        doc.view = ++view;
        doc.save();
        res.json(doc);
    })
});

router.post('', jwthandler ,async (req, res) => {

    let subject = req.body.subject;
    let author = req.body.author;
    let rawContent = req.body.rawContent;

    let noticeExists = true;
    await NoticeModel.count({subject}, (err, count) => {
        if (!count) {
            noticeExists = false;
        }
    });

    if ( !noticeExists ) {
       await NoticeModel.create({
           subject,
           author,
           date: new Date(),
           rawContent
       }, (err, doc) => {
           if(err) console.log(err);
           res.json({
               success: true,
               content: doc
           })
       });
    } else {
        res.json({
            error: 'Notice Exists'
        })
    }
});

router.put('', jwthandler, (req, res) => {
    let notice = req.body.notice;

    NoticeModel.findByIdAndUpdate(notice._id, notice).then(doc => res.json({success: true, previous: doc})).catch(err => res.json(err));
});

router.delete('', jwthandler, (req, res) => {
   let id = req.query.notice;

   NoticeModel.findByIdAndRemove(id).then(doc => {
       res.json({success: true, removed_notice: doc});
   }).catch(err => res.json(err));
});

export default router;
