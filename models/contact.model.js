import mongoose from 'mongoose';

const MongooseModel = mongoose.model('Notice', mongoose.Schema({
    subject: {type: String, required: true, trim: true},
    author: {type: String, required: true, trim: true},
    view: {type: Number, default: 0},
    date: {type: Date},
    rawContent: {type: String}
}));

export {MongooseModel as NoticeModel};
