import { isValidObjectId } from 'mongoose'
import Category from './category.model.js'
import Product from '../product/product.model.js'

export const defaultCategory = async()=>{
        let defaultCategory = await Category.findOne({name: "Uncategorized"})
        if(!defaultCategory){
            defaultCategory = new Category(
                {
                    name: "Uncategorized",
                    description: "Categoría por defecto para los productos",
                    status: true
                }
            )
            await defaultCategory.save()
        }
        return defaultCategory._id
}

export const addCategory = async(req, res)=>{
    try{
        if (!req.user || req.user.role !== 'ADMIN') {
            return res.status(403).send(
                {
                    success: false,
                    message: 'Only admin can add categories'
                }
            )
        }
        let data = req.body
        const existCategory = await Category.findOne(
            {
                name: data.name
            }
        )
        if(existCategory)
            return res.status(400).send(
            {
                succes: false,
                message: "Category already exists"
            }
        )
        const newCategory =  new Category(data)
        await newCategory.save()
        return res.status(201).send(
            {
                succes: true,
                message: 'Categoy added successfully'
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                succes: false,
                message: 'Error when adding Category',
                err
            }
        )
    }
}

export const getCategory = async(req, res)=>{
    try{
        if (!req.user || req.user.role !== 'ADMIN') {
            return res.status(403).send(
                {
                    success: false,
                    message: 'Only admin can get the data'
                }
            )
        }
        const {limit = 20, skip = 0} = req.query
                const category = await Category.find()
                    .skip(skip)
                    .limit(limit)
        
                if(category.length === 0) return res.status(404).send(
                    {
                        succes: false,
                        message: 'Categories not found'
                    }
                )
                return res.send(
                    {
                        succes: true,
                        message: 'Categories found: ', 
                        category,
                        total: category.length
                    }
                )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error',
                err
            }
        )
    }
}

export const updateCategory = async(req, res)=>{
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
        const categoryToUpdate = await Category.findByIdAndUpdate(
            id, 
            data,
            {new: true}
        )
        if(!categoryToUpdate) return res.status.send(
            {
                succes: false,
                message: 'Category not found'
            }
        )
        return res.send(
            {
                succes: true,
                message: 'Category updated',
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error',
            }
        )
    }
}

export const deleteCategory = async(req, res)=>{
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
        const defaultCategoryId = await defaultCategory()
        await Product.updateMany(
            {
                category: id
            },
            {
                category: defaultCategoryId
            }
        )
        const deletedCategory = await Category.findByIdAndUpdate(
            id,
            {
                status: false
            },
            {
                new: true
            }
        )
        if(!deletedCategory) return res.staus(404).send(
            {
                succes: false,
                message: 'Category not found'
            }
        )
        return res.send(
            {
                succes: true,
                message: 'Category deleted'
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error',
                err
            }
        )
    }
}