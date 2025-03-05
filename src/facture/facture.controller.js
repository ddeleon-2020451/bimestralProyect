import Facture from './facture.model.js'
import Product from '../product/product.model.js'
import User from '../user/user.model.js'

export const addFacture = async (req, res) => {
    try {
        const { userId, products } = req.body

        // Verificar si el usuario existe
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).send({
                success: false,
                message: 'User not found'
            })
        }

        // Verificar que los productos sean válidos
        let totalAmount = 0
        let productsDetails = []
        
        for (const item of products) {
            const product = await Product.findById(item.product)
            if (!product) {
                return res.status(400).send({
                    success: false,
                    message: `Product with ID ${item.product} not found`
                })
            }

            // Verificar que haya suficiente stock
            if (product.stock < item.quantity) {
                return res.status(400).send({
                    success: false,
                    message: `Insufficient stock for product ${product.name}. Available: ${product.stock}`
                })
            }

            // Calcular el total por producto
            const total = product.price * item.quantity
            productsDetails.push({
                product: item.product,
                quantity: item.quantity,
                price: product.price,
                total: total
            })

            // Sumar al total general
            totalAmount += total
        }

        // Crear la nueva facture
        const newFacture = new Facture({
            user: userId,
            products: productsDetails,
            totalAmount: totalAmount
        })

        await newFacture.save()

        return res.status(201).send({
            success: true,
            message: 'Facture created successfully',
            facture: newFacture
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'Error creating facture',
            err
        })
    }
}

export const getFactures = async (req, res) => {
    try {
        const userId = req.user._id 

        // Buscar todas las factures del usuario
        const factures = await Facture.find({ user: userId })
            .populate('products.product', 'name price')
            .populate('user', 'username')

        if (factures.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No factures found for this user'
            })
        }

        return res.status(200).send({
            success: true,
            message: 'Factures found',
            factures
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'Error fetching factures',
            err
        })
    }
}

export const updateFacturePaymentStatus = async (req, res) => {
    try {
        const { factureId, paymentStatus } = req.body

        // Verificar si el pago es válido
        if (!['Pending', 'Paid', 'Cancelled'].includes(paymentStatus)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid payment status'
            })
        }

        const facture = await Facture.findById(factureId)
        if (!facture) {
            return res.status(404).send({
                success: false,
                message: 'Facture not found'
            })
        }

        facture.paymentStatus = paymentStatus
        await facture.save()

        return res.status(200).send({
            success: true,
            message: 'Facture payment status updated',
            facture
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'Error updating facture payment status',
            err
        })
    }
}

export const updateFactureStatus = async (req, res) => {
    try {
        const { factureId, status } = req.body

        // Verificar si el estado es válido
        if (!['Active', 'Archived', 'Cancelled'].includes(status)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid facture status'
            })
        }

        const facture = await Facture.findById(factureId)
        if (!facture) {
            return res.status(404).send({
                success: false,
                message: 'Facture not found'
            })
        }

        facture.status = status
        await facture.save()

        return res.status(200).send({
            success: true,
            message: 'Facture status updated',
            facture
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'Error updating facture status',
            err
        })
    }
}
