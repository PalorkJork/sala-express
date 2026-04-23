const app = require("express");
const { Category, Product } = require("../../models");
const { Op } = require("sequelize");

const router = app.Router();

<<<<<<< HEAD
router.get("/list", async (req, res) => {
  const categories = await Category.findAll();

  res.json({
    message: "Category fetched successfully",
    data: categories,
  });
});

=======
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
router.post("", async (req, res) => {
  // Business logic

  const name = req.body.name;
  const isActive = req.body.isActive;

<<<<<<< HEAD
  const created = await Category.create({ name, isActive: true });
=======
  const created = await Category.create({ name, isActive });
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11

  res.json({
    message: "Category created successfully",
    data: created,
  });
});

router.put("/:id", async (req, res) => {
<<<<<<< HEAD
  // Business logic

  const id = req.params.id;
  const { name } = req.body;
  // const isActive = req.body.isActive;
=======
  const id = req.params.id;
  const { name } = req.body;
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11

  let category = await Category.findByPk(id);
  if (!category) {
    res.json({
<<<<<<< HEAD
      message: `Category Id=${id} not found`,
=======
      message: `Category id=${id} not found`,
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
    });
  }

  category = await category.update({ name });

  res.json({
<<<<<<< HEAD
    message: "Category updated successfully",
    data: category,
  });
});
=======
    message: "Category created successfully",
    data: category,
  });
});

>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  let category = await Category.findByPk(id);
  if (!category) {
    res.json({
<<<<<<< HEAD
      message: `Category Id=${id} not found`,
    });
  }

  // here to delete category =
  category = await category.destroy();
=======
      message: `Category id=${id} not found`,
    });
  }

  await category.destroy();
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11

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
<<<<<<< HEAD
=======

>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
  const categories = await Category.findAll({
    where: whereCondition,
    include: [
      {
        model: Product,
        as: "products",
<<<<<<< HEAD
        attributes: ["name"],
=======
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
      },
    ],
  });

  res.json({
    message: "Category fetched successfully",
    data: categories,
  });
});

<<<<<<< HEAD
=======
router.get("/list", async (req, res) => {
  const categories = await Category.findAll();

  res.json({
    message: "Category fetched successfully",
    data: categories,
  });
});

>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
module.exports = router;
