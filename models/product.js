"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      console.log("Models", models)
      // define association here
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
        
      });

      Product.hasMany(models.ProductImage, {
        foreignKey: "productId",
<<<<<<< HEAD
        as: "productImages",
=======
        as: "productImages"
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
      })
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      price: DataTypes.DECIMAL,
      qty: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Product",
    },
  );
  return Product;
};
