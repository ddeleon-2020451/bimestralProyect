import Product from './product.model.js'
import { defaultCategory } from '../category/category.controller.js'

export const addProduct = async(req,res)=>{
    try{
        if (!req.user || req.user.role !== 'ADMIN') {
            return res.status(403).send(
                {
                    success: false,
                    message: 'Only admin can add products'
                }
            )
        }
        let data = req.body
        const existProduct = await Product.findOne({name:data.name})
        if(existProduct){
            return res.status(400).send(
                {
                    succes: false,
                    message:'Product already exist',
                    data
                }
            )
        }
        const newProduct = new Product(data)
        await newProduct.save()
        return res.status(201).send(
            {
                succes: true,
                message:'Product added successfully',
            }
        )
    }catch(err){
        console.log(err)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error',
                err
            }
        )
    }
}

export const getProduct = async(req,res)=>{
    try{
        const {limit = 20, skip = 0} = req.query
        const products = await Product.find().skip(skip).limit(limit).populate(
            {
                path: 'category',
                select: 'name description'
            }
        )
        if(products.length === 0) return res.status(400).send(
            {
                succes: false,
                message: 'No products found',
            }
        )
        return res.status(200).send(
            {
                succes: true,
                message: 'Products found',
                products,
                total: products.length
            }
        )
    }catch(err){
        console.log(err)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error',
                err
            }
        )
    }
}

export const getProductId = async(req,res)=>{
    try{
        const { id } = req.params
        const product = await Product.findById(id).populate(
            {
                path: 'category',
                select: 'name description'
            }
        )
        if(!product) return res.status(400).send(
            {
                succes: false,
                message: 'Product not found',
            }
        )
        return res.send(
            {
                succes: true,
                message: 'Product found',
                product
            }
        )
    }catch(err){
        console.log(err)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error',
                err
            }
        )
    }
}

export const updateProduct = async(req,res)=>{
    try{
        if (!req.user || req.user.role !== 'ADMIN') {
            return res.status(403).send(
                {
                    success: false,
                    message: 'Only admin can update the data'
                }
            )
        }
        const {id} = req.params
        let data = req.body
        const product = await Product.findByIdAndUpdate(id, data, {new: true})
        if(!product) return res.status(404).send(
            {
                succes: false,
                message: 'Product not found'
            }
        )
        return res.status(200).send(
            {
                succes: true,
                message: 'Product updated'
            }
        )
    }catch(err){
        console.log(err)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error',
                err
            }
        )
    }
}

export const deleteProduct = async(req,res)=>{
    try{
        if (!req.user || req.user.role !== 'ADMIN') {
            return res.status(403).send(
                {
                    success: false,
                    message: 'Only admin can delete the product'
                }
            )
        }
        const {id} = req.params
        const defaultCategoryId = await defaultCategory()   
        const deletedProduct = await Product.findByIdAndUpdate(
            id,
            {
                category: defaultCategoryId,
                status: false,
            },
            {
                new: true
            }
        )
        if(!deletedProduct) return res.status(400).send(
            {
                succes: false,
                message: 'Product not found'
            }
        )
        return res.send(
            {
                succes: true,
                message: 'Product deleted and reassignded'
            }
        )
    }catch(err){
        console.log(err)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error',


            }
        )
    }
}