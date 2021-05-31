const express = require('express')
const router = express.Router()
const Cart = require('../models/Cart')
const auth = require('../middleware/auth')
const Item = require('../models/Item')

//VIEW CART
router.get("/", auth, async (req, res) => {
	try {
		const userId = req.user.id
		const cart = await Cart.findOne({userId})
		if(cart && cart.items.length > 0) {
			return res.json(cart)
		} else {
			return res.send("Your cart is empty")
		}
	} catch(err) {
		return res.status(400).json(err)
	}
})

//ADD TO CART
router.post("/", auth, async (req, res) => {
	try {
		const userId = req.user.id
		const { itemId, quantity } = req.body
		const item = await Item.findOne({_id: itemId})
		const cart = await Cart.findOne({userId})

		//IF CART IS EMPTY
		if(cart === null) {
			const newCart = await Cart.create({
				userId,
				items: [{itemId, name: item.name, quantity, price: item.price, subtotal: item.price * quantity}],
				total: item.price * quantity
			})
			return res.json({msg: "Item added to cart successfully", newCart})
		}

		if(cart) {
			const foundItem = cart.items.find(item => item.itemId === itemId)
			if(foundItem) { //if youre adding an item already existing in your cart.
				foundItem.quantity += quantity
				foundItem.subtotal += (quantity * foundItem.price)
				cart.total = (foundItem.quantity * foundItem.price)
				cart.items.map(item => item.itemId === itemId ? foundItem : item)
			} else {
				cart.items.push({
					itemId, 
					name: item.name, 
					quantity, 
					price: item.price, 
					subtotal: item.price * quantity
				})
				cart.total += (item.price * quantity)
			}	
			await cart.save()
			return res.json({msg: "Added to cart successfully", cart: cart.items, total: cart.total})
		}
	}catch(e) {
		return res.status(400).json(e)
	}
})

module.exports = router