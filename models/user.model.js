import mongoose from 'mongoose';
import {Schema} from  'mongoose';
import md5 from 'md5';

const theSchema = new Schema({
    username: {type: String, match: /[a-zA-Z0-9]+/g, required: true, unique: true},
    password: {type: String, required: true},
    salt: {type: String},
    date: {type: String}
});

theSchema.pre('save', function (next) {
    if (!this.date) {this.date = Date.now();}


    let salt = this.salt = (md5(Math.random()) + '').substr(Math.floor(Math.random() * 26), 5);
    this.password = md5(this.password + salt);

    next();
});

const MongooseModel = mongoose.model('User', theSchema);

export {MongooseModel as UserModel};
