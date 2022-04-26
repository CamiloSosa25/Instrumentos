import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAuth } from '../utils.js';

const adminRouter = express.Router();

adminRouter.get(
    '/all',

    expressAsyncHandler(async (req, res) => {
        const orders = await Order.find({ user: req.user._id });
        res.send(orders);
    })
)

adminRouter.get(
    '/:id', isAuth, expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id)
        if (order) {
            res.send(order)
        } else {
            res.status(404).send({ message: 'No se ha encontrado el pedido' })
        }
    })
)

adminRouter.put(
    '/:id/pay', isAuth, expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id)
        if (order) {
            order.isPaid = true
            order.paidAt = Date.now()

            const updateOrder = await order.save()
            res.send({ message: 'El pedido se ha pagado', order: updateOrder })
        } else {
            res.status(404).send({ message: 'No se ha encontrado el pedido' })
        }
    })
)



export default adminRouter;