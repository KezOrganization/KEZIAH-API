import { Product } from '../Models/Product_Mod.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../Configs/cloudinary.js';


// CREATE PRODUCT

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: 'skincare-products',
    });

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: uploadedImage.secure_url,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.error('Create product error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// GET ALL PRODUCTS

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// GET PRODUCT BY ID

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// SEARCH PRODUCTS by Name or Category
export const searchProducts = async (req, res) => {
  try {
    const { name, category } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Search products error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// UPDATE PRODUCT

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: 'skincare-products',
      });
      product.image = uploadedImage.secure_url;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;

    const updatedProduct = await product.save();

    res.json({ message: 'Product updated', product: updatedProduct });
  } catch (error) {
    console.error('Update product error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// DELETE PRODUCT

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
