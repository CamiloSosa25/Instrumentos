import { useEffect, useReducer, useState } from "react"
import { Link } from "react-router-dom"
import axios from 'axios'
import logger from 'use-reducer-logger'
//import data from "../data"

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loadings: true }
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loadings: false }
        case 'FETCH_FAIL':
            return { ...state, loadings: false, error: action.payload }
        default:
            return state
    }
}

function HomeScreen() {
    const [{ loading, error, products }, dispatch] = useReducer(reducer, {
        products: [],
        loading: true,
        error: '',
    })
    //const [products, setProducts] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' })
            try {
                const result = await axios.get('/api/products')
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message })
            }
            const result = await axios.get('/api/products')
            //setProducts(result.data)
        };
        fetchData()
    }, [])
    return (
        <div>
            <h1>Recomendados</h1>
            <div className="products">

                {products.map(product => (
                    <div className="product" key={product.slug}>
                        <Link to={`/product/${product.slug}`}>
                            <img src={product.image} alt={product.name} />
                        </Link>
                        <div className="product-info">
                            <Link to={`/product/${product.slug}`}>
                                <p>{product.name}</p>
                            </Link>
                            <p><strong>${product.price}</strong></p>
                            <button>Agregar al carrito</button>
                        </div>
                    </div>
                )
                )}
            </div>
        </div>
    )
}

export default HomeScreen