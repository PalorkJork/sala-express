const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const { Product, ProductImage, Category } = require("../../models");
const { Op } = require("sequelize");
const productimage = require("../../models/productimage");

const router = express.Router();

// GET all products with pagination & search
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let whereCondition = {};
    if (req.query.search) {
      whereCondition.name = { [Op.iLike]: `%${req.query.search}%` };
    }
    if (req.query.categoryId) {
      whereCondition.categoryId = req.query.categoryId;
    }

    const { rows: products, count: total } = await Product.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        {
          model: ProductImage, 
          as: "productImages",
          attributes: ["id", "productId", "imageUrl", "fileName"]
        }
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

// CREATE product
router.post("/", async (req, res) => {
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
  const image = await ProductImage.findOne({
    where: {
      id: imageId
    }
  })
  if(!image){
    return res(404).json({
      message: `Product image id=${imageId} not found`
    })
  }

  // remove image from folder uploads
  const fileName = image.imageUrl.split("/").pop();
  console.log("fileName", fileName)

  const filePath = path.join(process.cwd(), "uploads/products", fileName)

  if(fs.existsSync(filePath)){
    fs.unlinkSync(filePath)
  }

  // remove data from db
  await image.destroy();

  return res.json({
    message: "Product Image deleted successfully"
  })

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