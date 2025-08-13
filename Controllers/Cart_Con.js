import { Cart } from '../Models/Cart_Mod.js';
import { Product } from '../Models/Product_Mod.js';

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId?.toString();  
    const quantity = parseInt(req.body.quantity, 10) || 1;  

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required in URL' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Add to cart error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get user's cart
export const getMyCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update item quantity in cart
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId?.toString(); // from URL params
    const quantity = parseInt(req.body.quantity, 10);   // from request body

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find((item) => {
      const itemId = item.product?._id ? item.product._id.toString() : item.product.toString();
      return itemId === productId;
    });

    if (!item) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    item.quantity = quantity;
    await cart.save();

    res.json({ message: 'Cart item quantity updated', cart });
  } catch (error) {
    console.error('Update cart error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

//REemove a single an item from cart
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error('Remove from cart error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await Cart.deleteOne({ user: userId });

    res.json({ message: 'Cart cleared and deleted' });
  } catch (error) {
    console.error('Clear cart error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
