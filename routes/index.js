import express from 'express';

const router = express.Router();

/* GET index page. */
router.get('/', (req, res) => {

    res.json({
        success: true,
        environment: express().get('env')
    });
});

export default router;
