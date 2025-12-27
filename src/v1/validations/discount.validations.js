const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

class DiscountJoiBuilder {
  constructor() {
    this.schema = Joi.object({
      /** OWNER */
      discount_shop: objectId,

      /** BASIC INFO */
      discount_name: Joi.string().trim().min(3).max(100),
      discount_code: Joi.string().trim().uppercase().min(3).max(30),
      description: Joi.string().trim().max(500).allow(""),

      /** DISCOUNT */
      discount_type: Joi.string().valid("percentage", "fixed"),
      discount_value: Joi.number().positive(),
      max_discount_amount: Joi.number().positive().allow(null),

      /** APPLY CONDITION */
      min_order_value: Joi.number().min(0),

      /** APPLY TARGET */
      applies_to: Joi.string().valid(
        "all",
        "specific_products",
        "specific_categories"
      ),
      product_ids: Joi.array().items(objectId),
      category_ids: Joi.array().items(objectId),

      /** USAGE */
      total_uses: Joi.number().integer().min(0),
      max_uses: Joi.number().integer().min(1),
      max_uses_per_user: Joi.number().integer().min(1),
      used_by_users: Joi.array().items(objectId),

      /** TIME */
      start_date: Joi.date(),
      end_date: Joi.date(),

      /** STATUS */
      is_active: Joi.boolean()
    }).options({
      abortEarly: false,
      stripUnknown: true
    });
  }

  /* =========================
   * BASIC POLICIES
   * ========================= */

  require(fields = []) {
    this.schema = this.schema.fork(fields, s => s.required());
    return this;
  }

  forbid(fields = []) {
    this.schema = this.schema.fork(fields, () => Joi.forbidden());
    return this;
  }

  minKeys(count = 1) {
    this.schema = this.schema.min(count);
    return this;
  }

  /* =========================
   * BUSINESS POLICIES
   * ========================= */

  /** discount_type ↔ max_discount_amount */
  enforceDiscountTypeRule() {
    this.schema = this.schema
      .when(Joi.object({ discount_type: "percentage" }).unknown(), {
        then: Joi.object({
          max_discount_amount: Joi.number().positive().required()
        })
      })
      .when(Joi.object({ discount_type: "fixed" }).unknown(), {
        then: Joi.object({
          max_discount_amount: Joi.forbidden()
        })
      });

    return this;
  }

  /** discount_value theo type */
  enforceDiscountValueRule() {
    this.schema = this.schema
      .when(Joi.object({ discount_type: "percentage" }).unknown(), {
        then: Joi.object({
          discount_value: Joi.number().greater(0).max(100).required()
        })
      })
      .when(Joi.object({ discount_type: "fixed" }).unknown(), {
        then: Joi.object({
          discount_value: Joi.number().greater(0).required()
        })
      });

    return this;
  }

  /** applies_to ↔ product_ids / category_ids */
  enforceApplyTargetRule() {
    this.schema = this.schema
      .when(Joi.object({ applies_to: "specific_products" }).unknown(), {
        then: Joi.object({
          product_ids: Joi.array().items(objectId).min(1).required(),
          category_ids: Joi.forbidden()
        })
      })
      .when(Joi.object({ applies_to: "specific_categories" }).unknown(), {
        then: Joi.object({
          category_ids: Joi.array().items(objectId).min(1).required(),
          product_ids: Joi.forbidden()
        })
      })
      .when(Joi.object({ applies_to: "all" }).unknown(), {
        then: Joi.object({
          product_ids: Joi.forbidden(),
          category_ids: Joi.forbidden()
        })
      });

    return this;
  }

  /** start_date < end_date */
  enforceDateRangeRule() {
    this.schema = this.schema.when(
      Joi.object({
        start_date: Joi.exist(),
        end_date: Joi.exist()
      }).unknown(),
      {
        then: Joi.object({
          end_date: Joi.date().greater(Joi.ref("start_date"))
        })
      }
    );
    return this;
  }

  /** total_uses <= max_uses */
  enforceUsageLimitRule() {
    this.schema = this.schema.when(
      Joi.object({
        total_uses: Joi.exist(),
        max_uses: Joi.exist()
      }).unknown(),
      {
        then: Joi.object({
          total_uses: Joi.number().max(Joi.ref("max_uses"))
        })
      }
    );
    return this;
  }

  /** escape hatch nếu cần custom when */
  when(condition, options) {
    this.schema = this.schema.when(condition, options);
    return this;
  }

  build() {
    return this.schema;
  }
}

module.exports = {
  DiscountJoiBuilder
};
