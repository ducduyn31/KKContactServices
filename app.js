import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
// import favicon from 'serve-favicon';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const debug = Debug('kk-contact-service:app');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) {
            return cb(new Error('Require Origin'), false);
        }
        if (app.get('env') === 'development' && origin === 'http://localhost:4200') {
            return cb(null, true);
        } else if (app.get('env') === 'production' && (origin === 'http://kosmetics.kr' || origin === 'http://admin.kosmetics.kr')) {
            return cb(null, true);
        }
        return cb(new Error('Not whitelisted!'), false);
        //return cb(null, true);
    }
}));

import {MONGO_DB} from './config/setup.js'

mongoose.connect(MONGO_DB);

import index from './routes/index';
import contact from './routes/contact';
import notice from './routes/notice';
import auth from './routes/auth';

app.use('/', index);
app.use('/contact', contact);
app.use('/notice', notice);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.json(err);
});

// Handle uncaughtException
process.on('uncaughtException', (err) => {
    debug('Caught exception: %j', err);
    process.exit(1);
});

export default app;
