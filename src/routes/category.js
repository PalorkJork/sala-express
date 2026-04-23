const app = require("express");
const { Category, Product } = require("../../models");
const { Op } = require("sequelize");

const router = app.Router();

router.get("/list", async (req, res) => {
  const categories = await Category.findAll();

  res.json({
    message: "Category fetched successfully",
    data: categories,
  });
});

router.post("", async (req, res) => {
  // Business logic

  const name = req.body.name;
  const isActive = req.body.isActive;

  const created = await Category.create({ name, isActive: true });

  res.json({
    message: "Category created successfully",
    data: created,
  });
});

router.put("/:id", async (req, res) => {
  // Business logic

  const id = req.params.id;
  const { name } = req.body;
  // const isActive = req.body.isActive;

  let category = await Category.findByPk(id);
  if (!category) {
    res.json({
      message: `Category Id=${id} not found`,
    });
  }

  category = await category.update({ name });

  res.json({
    message: "Category updated successfully",
    data: category,
  });
});
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  let category = await Category.findByPk(id);
  if (!category) {
    res.json({
      message: `Category Id=${id} not found`,
    });
  }

  // here to delete category =
  category = await category.destroy();

  res.json({
    message: "Category deleted successfully",
    data: category,
  });
});

router.get("", async (req, res) => {
  let whereCondition = {};
  if (req.query.search) {
    whereCondition.name = {
      [Op.iLike]: `%${req.query.search}%`,
    };
  }
  const categories = await Category.findAll({
    where: whereCondition,
    include: [
      {
        model: Product,
        as: "products",
        attributes: ["name"],
      },
    ],
  });

  res.json({
    message: "Category fetched successfully",
    data: categories,
  });
});

module.exports = router;
