const express = require("express");
const db = require("./models");
const path = require("path");
const cors = require("cors");
<<<<<<< HEAD
require("dotenv").config();
=======
require('dotenv').config();
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11

const authRoute = require("./src/routes/auth");
const customerRoute = require("./src/routes/customer");
const userRoute = require("./src/routes/user");
const productRoute = require("./src/routes/product");
const orderRoute = require("./src/routes/order");
const categoryRoute = require("./src/routes/category");
const paymentRoute = require("./src/routes/payment");
<<<<<<< HEAD


=======
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11

const fileUpload = require("express-fileupload");

const authMiddleware = require("./src/middlewares/authMiddleware");

const app = express();
const port = 3000;
const { Category, Product, Customer, Order, OrderDetail, User } = require("./models");

const allowedOrigins = [
  "http://localhost:3000",
  "https://www.abc.com",
  "http://localhost:5173",
  "https://sala-react-v2-nac3.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // or if the origin is in the whitelist
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE", // Specify allowed methods
  credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(
  fileUpload({
    limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
    createParentPath: true,
  })
);

app.use(
  "/uploads/products",
  express.static(path.join(process.cwd(), "uploads/products"))
);

db.sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Unable connect to database", err));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/customers", authMiddleware, customerRoute);

app.use("/api/v1/users", authMiddleware, userRoute);
app.use("/api/v1/products", authMiddleware, productRoute);
app.use("/api/v1/orders", authMiddleware, orderRoute);
<<<<<<< HEAD
app.use("/api/v1/categories", authMiddleware, categoryRoute);
app.use("/api/v1/payments", authMiddleware, paymentRoute);

app.get("/api/v1/health", (req, res) => {
  res.json({
    message: "OK",
  });
});
=======
app.use("/api/v1/categories", authMiddleware ,categoryRoute);
app.use("/api/v1/payments", authMiddleware ,paymentRoute);

app.get('/api/v1/health', (req, res)=> {
  return res.json({
    message: 'ok'
  })
})
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11

app.post("/api/v1/orders", async (req, res) => {
  try {
    console.log("Request body", req.body);
<<<<<<< HEAD
    const { customerId, location, items, discount } = req.body;
=======
    const { items, discount } = req.body;
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11

    // const customer = await Customer.findByPk(customerId);
    // console.log("Customer", customer);

    // if (!customer) {
    //   res.json({
    //     message: "Customer not found",
    //   });
    // }

    const orderDetailsData = [];
    let total = 0;
    for (const item of items) {
      const { productId, qty } = item;

      // Get product info
      const product = await Product.findByPk(productId);
      if (!product) {
        res.json({
          message: `Product id=${productId} not found`,
        });
      }

      console.log("Product", product);
      const amount = product.price * qty;

      // total = total + amount
      total += amount;

      orderDetailsData.push({
        productId,
        productName: product.name,
        productPrice: product.price,
        qty,
        amount,
      });
    }

    console.log("OrderDetails", orderDetailsData);
<<<<<<< HEAD

    const orderNumber = generateInvoiceNumber();

=======
    const orderNumber = generateInvoiceNumber()
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11
    // Create order into db
    const createdOrder = await Order.create({
      customerId: 0,
      orderNumber: orderNumber,
      total: total,
      discount: discount,
      orderDate: new Date(),
      location: "N/A",
    });

    console.log("Created order", createdOrder);

    // Create order detail into db

    const orderDetails = orderDetailsData.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      productPrice: item.productPrice,
      qty: item.qty,
      amount: item.amount,
      orderId: createdOrder.id,
    }));

    await OrderDetail.bulkCreate(orderDetails);

    const completedOrder = await Order.findByPk(createdOrder.id, {
      include: [
        // {
        //   model: Customer,
        //   as: "customer",
        // },
        {
          model: OrderDetail,
          as: "orderDetails",
        },
      ],
    });
    res.json({
      message: "Order completed",
      data: completedOrder,
    });
  } catch (error) {
    console.log("Error", error);
  }
});

<<<<<<< HEAD
function generateInvoiceNumber() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `SalaIT-${year}${month}${day}-${hours}${minutes}`;
}

=======

function generateInvoiceNumber() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `SalaIT-${year}${month}${day}-${hours}${minutes}`;
}
>>>>>>> 13fc290d241a75dad62e4581fa367fbd008d2d11

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


// Homework
// Create table payment
// ID number
// method string // cash, card, aba_khqr
// status string // PENDING, PAID, CANCELLED
// paidAt date
// remark text
// amount decimal
// paywayTranId string