import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js'
import productRouter from './routes/productRoutes.js';


dotenv.config()

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('connect to db')
}).catch(err => {
    console.log(err.message)
})

const app = express();
app.use('/api/seed', seedRouter)
// test
app.use(express.static('public'))
app.use('/api/products', productRouter)
app.get('/api/products/slug/:slug', (req, res) => {
    const product = data.products.find((x) => x.slug === req.params.slug);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'No se ha encontrado el producto' });
    }
});
app.get('/api/products/:id', (req, res) => {
    const product = data.products.find((x) => x._id === req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'No se ha encontrado el producto' });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`serve at http://localhost:${port}`);
});

