import mongoose from 'mongoose';
import {Schema} from 'mongoose';

class CustomerSupport {
    constructor(name, email, title, description, tel, company, attachment) {
        this.name = name;
        this.email = email;
        this.title = title;
        this.description = description;
        this.tel = tel;
        this.company = company;
        this.attachment = attachment;
    }
}

const MongooseModel = mongoose.model('CustomerSupport', mongoose.Schema({
    name: {type: String, required: [true, 'Name is required!']},
    email: {type: String, match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,'Email is not valid!']},
    title: {type: String},
    description: {type: String},
    tel: {type: String, match: /[0-9]+/},
    company: {type: String},
    attachment: [{type: Schema.Types.ObjectId, ref: 'Attachment'}],
    read: {type: Boolean}
}));

export {CustomerSupport, MongooseModel as CustomerSupportModel};
