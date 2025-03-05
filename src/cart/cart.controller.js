import Cart from './cart.model.js'
import Product from '../product/product.model.js'

export const addCart = async (req, res) => {
    try {
        const { user, product, quantity } = req.body
        if (!user) {
            return res.status(400).send(
                {
                    success: false,
                    message: "User ID is required"
                }
            )
        }

        if (!product || !quantity) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'Product and quantity are required'
                }
            )
        }

        let existingCart = await Cart.findOne(
            {
                user: user
            }
        )

        if (!existingCart) {
            // Si no existe un carrito, creamos uno nuevo
            const foundProduct = await Product.findById(product)
            if (!foundProduct) {
                return res.status(400).send(
                    {
                        success: false,
                        message: `Product ${product} not found`
                    }
                )
            }

            if (foundProduct.stock < quantity) {
                return res.status(400).send(
                    {
                        success: false,
                        message: `Product ${product} is out of stock`
                    }
                )
            }

            const newCart = new Cart(
                {
                    user: user,
                    product: product,
                    quantity: quantity
                }
            )
            await newCart.save()

            return res.status(201).send(
                {
                    success: true,
                    message: 'Product added to cart'
                }
            )
        } else {
            // Si el carrito ya existe, agregamos el producto
            const foundProduct = await Product.findById(product)
            if (!foundProduct) {
                return res.status(400).send(
                    {
                        success: false,
                        message: `Product ${product} not found`
                    }
                )
            }

            if (foundProduct.stock < quantity) {
                return res.status(400).send(
                    {
                        success: false,
                        message: `Product ${product} is out of stock`
                    }
                )
            }

            // Verificamos si el producto ya está en el carrito
            const productIndex = existingCart.products.findIndex(item => item.product.toString() === product)

            if (productIndex !== -1) {
                // Si el producto ya está en el carrito, sumamos la cantidad
                existingCart.products[productIndex].quantity += quantity
            } else {
                // Si el producto no está en el carrito, lo agregamos
                existingCart.products.push({ product, quantity })
            }

            // Guardamos el carrito actualizado
            await existingCart.save()

            return res.status(200).send(
                {
                    success: true,
                    message: 'Product added to cart',
                    cart: existingCart
                }
            )
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error adding cart',
                err
            }
        )
    }
}

export const getCart = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'User not found'
                }
            )
        }

        const cart = await Cart.findOne(
            {
                user: req.user._id
            }
        ).populate(
            {
                path: 'products',
                select: 'name price'
            }
        ).populate(
            {
                path: 'user',
                select: 'username'
            }
        )

        if (!cart) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'Cart not found'
                }
            )
        }

        return res.status(200).send(
            {
                success: true,
                message: 'Cart found',
                cart
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error getting cart',
                err
            }
        )
    }
}
