import mongoose from 'mongoose';
import {Types} from 'mongoose/lib/schema'

class Attachment {
    constructor(originalName, encoding, mimetype, destination, filename, size) {
        this.originalName = originalName;
        this.encoding = encoding;
        this.mimetype = mimetype;
        this.destination = destination;
        this.filename = filename;
        this.size = size;
    }
}

const MongooseModel = mongoose.model('Attachment', mongoose.Schema({
    originalName: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    size: Number,
}));

export {Attachment, MongooseModel as AttachmentModel}
