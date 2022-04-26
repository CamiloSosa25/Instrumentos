import React, { useContext, useEffect, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Store } from '../Store'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import axios from 'axios'
import { getError } from '../utils'
import Button from 'react-bootstrap/Button'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, orders: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default function AdminHistoryScreen() {
    const { state } = useContext(Store)
    const { userInfo } = state
    const navigate = useNavigate()
    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' })

            try {
                const { data } = await axios.get(
                    `/api/orders/all`,

                    { headers: { Authorization: `Bearer ${userInfo.token}` } }
                );
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (error) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(error),
                });
            }
        }
        fetchData()
    }, [userInfo]);

    return (
        <div>
            <Helmet>
                <title>Historial todos los pedidos</title>
            </Helmet>
            <h1>Historial de pedidos</h1>
            {loading ? (
                <LoadingBox></LoadingBox>

            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Pagado</th>
                            <th>Entregado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{order.totalPrice.toFixed(2)}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                                <td>
                                    {order.isDelivered
                                        ? order.deliveredAt.substring(0, 10)
                                        : 'No'}
                                </td>
                                <td>
                                    <Button
                                        type="button"
                                        variant="light"
                                        onClick={() => {
                                            navigate(`/order/${order._id}`);
                                        }}
                                    >
                                        Detalles
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
            }
        </div>
    )
}
