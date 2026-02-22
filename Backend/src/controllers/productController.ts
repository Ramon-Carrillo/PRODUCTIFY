import type { Request, Response } from 'express'

import * as queries from '../db/queries'
import { getAuth } from '@clerk/express'

// Get all products (public)
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await queries.getAllProducts()
    res.status(200).json(products)
  } catch (error) {
    console.error('Error getting products:', error)
    res.status(500).json({ error: 'Failed to get products' })
  }
}

// Get products by current user (protected)
export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const products = await queries.getProductsByUserId(userId)
    res.status(200).json(products)
  } catch (error) {
    console.error('Error getting user products:', error)
    res.status(500).json({ error: 'Failed to get user products' })
  }
}

// Get single product by ID (public)
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const rawId = Array.isArray(id) ? id[0] : id
    if (!rawId) return res.status(400).json({ error: 'Product id is required' })
    const product = await queries.getProductById(rawId)

    if (!product) return res.status(404).json({ error: 'Product not found' })

    res.status(200).json(product)
  } catch (error) {
    console.error('Error getting product:', error)
    res.status(500).json({ error: 'Failed to get product' })
  }
}

// Create product (protected)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { title, description, imageUrl } = req.body
    const isNonEmptyString = (v: unknown) =>
      typeof v === 'string' && v.trim().length > 0

    if (
      !isNonEmptyString(title) ||
      !isNonEmptyString(description) ||
      !isNonEmptyString(imageUrl)
    ) {
      res
        .status(400)
        .json({ error: 'Title, description, and imageUrl are required' })
      return
    }

    const product = await queries.createProduct({
      title,
      description,
      imageUrl,
      userId,
    })

    res.status(201).json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ error: 'Failed to create product' })
  }
}

// Update product (protected - owner only)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { id } = req.params
    const { title, description, imageUrl } = req.body
    const isNonEmptyString = (v: unknown) =>
      typeof v === 'string' && v.trim().length > 0
    const updates: Partial<{
      title: string
      description: string
      imageUrl: string
    }> = {}
    if (title !== undefined) {
      if (!isNonEmptyString(title)) {
        return res.status(400).json({ error: 'Invalid title' })
      }
      updates.title = title
    }
    if (description !== undefined) {
      if (!isNonEmptyString(description)) {
        return res.status(400).json({ error: 'Invalid description' })
      }
      updates.description = description
    }
    if (imageUrl !== undefined) {
      if (!isNonEmptyString(imageUrl)) {
        return res.status(400).json({ error: 'Invalid imageUrl' })
      }
      updates.imageUrl = imageUrl
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'At least one field is required' })
    }

    // Check if product exists and belongs to user
    const existingProduct = await queries.getProductById(
      Array.isArray(id) ? id[0] : id
    )
    if (!existingProduct) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    if (existingProduct.userId !== userId) {
      res.status(403).json({ error: 'You can only update your own products' })
      return
    }

    const product = await queries.updateProduct(
      Array.isArray(id) ? id[0] : id,
      updates
    )

    res.status(200).json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ error: 'Failed to update product' })
  }
}

// Delete product (protected - owner only)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req)
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { id } = req.params

    // Check if product exists and belongs to user
    const existingProduct = await queries.getProductById(
      Array.isArray(id) ? id[0] : id
    )
    if (!existingProduct) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    if (existingProduct.userId !== userId) {
      res.status(403).json({ error: 'You can only delete your own products' })
      return
    }

    await queries.deleteProduct(Array.isArray(id) ? id[0] : id)
    res.status(200).json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'Failed to delete product' })
  }
}
