const mongoose = require('mongoose');
const slugify = require('slugify');

const COLLECTION_NAME = 'ProductCollection'
const DOCUMENT_NAME = 'ProductDocument'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    sku: {
      type: String,
      unique: true,
      sparse: true
    },

    category: {
      type: String
    },

    tags: {
      type: [String],
      index: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    salePrice: {
      type: Number,
      min: 0
    },

    stock: {
      type: Number,
      default: 0,
      min: 0
    },

    description:{
        type : String,
        trim : true
    },

    images: [
      {
        url: { type: String },
        alt: { type: String }
      }
    ],

    attributes: {
      type: mongoose.Schema.Types.Mixed
    },
    isDraft : {
      type : Boolean,
      require : true,
      default : true

    },
    isPublished : {
      type : Boolean,
      require : true,
      default : false
    },
    product_shop: {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Shop',
      required:true
    }
  },
  {
    timestamps: true,
    collection :COLLECTION_NAME
  }
);


productSchema.index({
  name : 'text',
  description : 'text'
})

productSchema.pre('validate', async function () {
  if (this.isModified('name')) {
    const baseSlug = slugify(this.name, {
      lower: true,
      strict: true,
      locale: 'vi'
    });

    let slug = baseSlug;
    let count = 1;

    while (
      await this.constructor.exists({
        slug,
        _id: { $ne: this._id }
      })
    ) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }

  if (!this.sku) {
    this.sku = `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

});

module.exports = {
    productModel: mongoose.model(DOCUMENT_NAME,productSchema)
}