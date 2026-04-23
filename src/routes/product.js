const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const { Product, ProductImage, Category } = require("../../models");
<<<<<<< HEAD
const { Op } = require("sequelize");
const productimage = require("../../models/productimage");
=======
const { Op, fn, col, where } = require("sequelize");
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11

const router = express.Router();

// GET all products with pagination & search
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let whereCondition = {};

    if (req.query.search) {
<<<<<<< HEAD
      whereCondition.name = { [Op.iLike]: `%${req.query.search}%` };
    }
    if (req.query.categoryId) {
      whereCondition.categoryId = req.query.categoryId;
=======
      const search = req.query.search.replace(/\s+/g, "").toLowerCase();

      whereCondition = where(
        fn("REPLACE", fn("LOWER", col("Product.name")), " ", ""),
        {
          [Op.like]: `%${search}%`,
        },
      );
    }

    if (req.query.categoryId) {
      whereCondition.categoryId = {
        [Op.eq]: req.query.categoryId,
      };
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
    }

    const { rows: products, count: total } = await Product.findAndCountAll({
      where: whereCondition,
      distinct: true,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        {
<<<<<<< HEAD
          model: ProductImage, 
          as: "productImages",
          attributes: ["id", "productId", "imageUrl", "fileName"]
        }
=======
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: ProductImage,
          as: "productImages",
          attributes: ["id", "productId", "imageUrl", "fileName"],
        },
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
      ],
    });

    const totalPages = Math.ceil(total / limit);

    res.json({
      message: "Product fetched successfully",
      data: products,
      pagination: {
        currentPage: page,
        limit,
        total,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (error) {
    console.error("Fetching products error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

<<<<<<< HEAD
// CREATE product
router.post("/", async (req, res) => {
=======
router.post("", async (req, res) => {
  router; // const name = req.body.name
  // const price = req.body.price
  // const categroyId = req.body.categroyId
  try {
    const { name, price, categoryId, isActive, qty } = req.body;

    const createdProduct = await Product.create({
      name,
      price,
      categoryId,
      qty,
      isActive,
    });
    res.json({
      message: "Product created successfully",
      data: createdProduct,
    });
  } catch (error) {
    console.log("Creating product error:", error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId, isActive, qty } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        message: `Product id=${id} not found`,
      });
    }

    await product.update({
      name,
      price,
      categoryId,
      qty,
      isActive,
    });

    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });

    res.json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.log("Updating product error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Image upload
router.post("/:id/upload", async (req, res) => {
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
  try {
    const { name, price, categoryId, isActive, qty } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: "name, price, categoryId required" });
    }

    const createdProduct = await Product.create({ name, price, categoryId, qty, isActive });
    res.json({ message: "Product created successfully", data: createdProduct });
  } catch (error) {
    console.error("Creating product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// UPDATE product
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId, isActive, qty } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: `Product id=${id} not found` });

    await product.update({ name, price, categoryId, qty, isActive });

    const updatedProduct = await Product.findByPk(id, {
      include: [{ model: Category, as: "category" }],
    });

    res.json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    console.error("Updating product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// UPLOAD product image
router.post("/:id/upload", async (req, res) => {
  try {
    const productId = req.params.id;

    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.files.file;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: `Product id=${productId} not found` });

    const fileName = `${uuidv4()}${path.extname(file.name)}`;
    const uploadPath = path.join(process.cwd(), "uploads/products", fileName);

    await file.mv(uploadPath);

    const domain = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${domain}/uploads/products/${fileName}`;

    const savedImage = await ProductImage.create({ productId, imageUrl, fileName: file.name });

    res.json({ message: "Upload image successfully", data: savedImage });
  } catch (error) {
    console.error("Uploading image error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DOWNLOAD product image
router.get("/images/:imageId/download", async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await ProductImage.findByPk(imageId);

    if (!image) return res.status(404).json({ message: `Product image id=${imageId} not found` });

    const fileName = image.imageUrl.split("/").pop();
    const filePath = path.join(process.cwd(), "uploads/products", fileName);

    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });

    res.download(filePath, image.fileName);
  } catch (error) {
    console.error("Downloading image error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/images/:imageId", async (req, res) => {
  const { imageId } = req.params;
<<<<<<< HEAD
  const image = await ProductImage.findOne({
=======

 const image = await ProductImage.findOne({
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
    where: {
      id: imageId
    }
  })
<<<<<<< HEAD
  if(!image){
    return res(404).json({
      message: `Product image id=${imageId} not found`
=======

  if(!image){
    return res(404).json({
      message: `Product Image id=${imageId} not found`
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
    })
  }

  // remove image from folder uploads
<<<<<<< HEAD
  const fileName = image.imageUrl.split("/").pop();
  console.log("fileName", fileName)
=======
  const fileName = image.imageUrl.split("/").pop()
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11

  const filePath = path.join(process.cwd(), "uploads/products", fileName)

  if(fs.existsSync(filePath)){
    fs.unlinkSync(filePath)
  }

  // remove data from db
<<<<<<< HEAD
  await image.destroy();
=======
  await image.destroy()
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11

  return res.json({
    message: "Product Image deleted successfully"
  })

<<<<<<< HEAD
  // try {
  //   const { imageId } = req.params;
  //   const image = await ProductImage.findByPk(imageId);

  //   if (!image) return res.status(404).json({ message: `Product image id=${imageId} not found` });

  //   const fileName = image.imageUrl.split("/").pop();
  //   const filePath = path.join(process.cwd(), "uploads/products", fileName);

  //   if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });

  //   fs.unlinkSync(filePath);
  //   await image.destroy();

  //   res.json({ message: "Image deleted successfully" });
  // } catch (error) {
  //   console.error("Deleting image error:", error);
  //   res.status(500).json({ message: "Internal server error" });
  // }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  let product = await Product.findByPk(id);
  if (!product) {
    res.json({
      message: `Product Id=${id} not found`,
    });
  }

  // here to delete category =
  product = await product.destroy();

  res.json({
    message: "Product deleted successfully",
    data: product,
  });
});

module.exports = router;
=======
});

module.exports = router;
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
