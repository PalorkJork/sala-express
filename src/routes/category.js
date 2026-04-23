const express = require("express"); // Use express directly
const { Category, Product } = require("../../models");
const { Op } = require("sequelize");

const router = express.Router();

// 1. Get All Categories (Simple List)
router.get("/list", async (req, res) => {
  const categories = await Category.findAll();
  res.json({
    message: "Category fetched successfully",
    data: categories,
  });
});

// 2. Search Categories with Products
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
        attributes: ["name"], // Kept your attribute filtering
      },
    ],
  });

  res.json({
    message: "Category fetched successfully",
    data: categories,
  });
});

// 3. Create Category
router.post("", async (req, res) => {
  const { name, isActive } = req.body;
  const created = await Category.create({ name, isActive });

  res.json({
    message: "Category created successfully",
    data: created,
  });
});

// 4. Update Category
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  let category = await Category.findByPk(id);
  if (!category) {
    return res.status(404).json({
      message: `Category id=${id} not found`,
    });
  }

  category = await category.update({ name });

  res.json({
    message: "Category updated successfully",
    data: category,
  });
});

// 5. Delete Category
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  let category = await Category.findByPk(id);
  if (!category) {
    return res.status(404).json({
      message: `Category id=${id} not found`,
    });
  }

  await category.destroy();

  res.json({
    message: "Category deleted successfully",
    data: category,
  });
});

module.exports = router;