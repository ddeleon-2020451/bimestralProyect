import mongoose from 'mongoose'

const factureSchema = new mongoose.Schema(
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        products: [
            {
                product: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'Product', 
                    required: true 
                },
                quantity: { 
                    type: Number, 
                    required: true 
                },
                price: { 
                    type: Number, 
                    required: true 
                },
                total: { 
                    type: Number, 
                    required: true 
                }
            }
        ],
        totalAmount: { 
            type: Number, 
            required: true 
        },
        factureDate: { 
            type: Date, 
            default: Date.now 
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid', 'Cancelled'],
            default: 'Pending'
        },
        status: {
            type: String,
            enum: ['Active', 'Archived', 'Cancelled'],
            default: 'Active'
        }
    }
)

const Facture = mongoose.model('Facture', factureSchema)

export default Facture
