<<<<<<< HEAD
'use strict';
const {
  Model
} = require('sequelize');
=======
"use strict";
const { Model } = require("sequelize");
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
<<<<<<< HEAD
  Payment.init({

=======
  Payment.init(
    {
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
      orderId: DataTypes.INTEGER,
      paywayTranId: DataTypes.STRING,
      method: DataTypes.STRING,
      status: DataTypes.STRING,
      paidAt: DataTypes.DATE,
      remark: DataTypes.TEXT,
      amount: DataTypes.DECIMAL,
<<<<<<< HEAD
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};
=======
    },
    {
      sequelize,
      modelName: "Payment",
    },
  );
  return Payment;
};
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
