const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
	userId: { type: String },
	items: [{
		itemId: { type: String },
		name: String,
		quantity: {
			type: Number,
			required: true,
			min: [1, "Quantity item should be 1 or more"],
			default: 1
		},
		price: Number
	}],
	total: {
		type: Number,
		required: true
	},
	purchased_data: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Order', OrderSchema)