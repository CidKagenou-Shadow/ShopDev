const mongoose = require('mongoose')

const DOCUMENT_NAME = "Discount"
const COLLECTION_NAME = "Discounts"

const discountSchema = new mongoose.Schema({
  /** ========================
   *  OWNER / SCOPE
   *  ======================== */
  discount_shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
    index: true
  },

  /** ========================
   *  BASIC INFO
   *  ======================== */
  discount_name: {
    type: String,
    required: true,
    trim: true
  },

  discount_code: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },

  description: {
    type: String,
    trim: true
  },

  /** ========================
   *  DISCOUNT TYPE & VALUE
   *  ======================== */
  discount_type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },

  discount_value: {
    type: Number,
    required: true,
    min: 0
  },

  max_discount_amount: {
    type: Number,
    min: 0,
    default: null
  },

  /** ========================
   *  APPLY CONDITION
   *  ======================== */
  min_order_value: {
    type: Number,
    min: 0,
    default: 0
  },

  /** ========================
   *  APPLY TARGET
   *  ======================== */
  applies_to: {
    type: String,
    enum: ['all', 'specific_products', 'specific_categories'],
    default: 'all'
  },

  product_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    default: []
  },

  category_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Category',
    default: []
  },

  /** ========================
   *  USAGE LIMIT
   *  ======================== */
  total_uses: {
    type: Number,
    default: 0
  },

  max_uses: {
    type: Number,
    required: true,
    min: 1
  },

  max_uses_per_user: {
    type: Number,
    default: 1,
    min: 1
  },

  used_by_users: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },

  /** ========================
   *  TIME RANGE
   *  ======================== */
  start_date: {
    type: Date,
    required: true
  },

  end_date: {
    type: Date,
    required: true
  },

  /** ========================
   *  STATUS
   *  ======================== */
  is_active: {
    type: Boolean,
    default: true,
    index: true
  }

},{
  timestamps: true,
  collection: COLLECTION_NAME
})

/** ========================
 *  INDEXES
 *  ======================== */
discountSchema.index(
  { discount_code: 1, discount_shop: 1 },
  { unique: true }
)

module.exports = {
  DiscountModel: mongoose.model(DOCUMENT_NAME, discountSchema)
}
