const app = require("express");
const { User } = require("../../models");

const router = app.Router();
// get all user
router.get("", async (req, res) => {
  try {
    const users = await User.findAll();

    res.json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});
// get user by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ data: user });
});

router.post("", async (req, res) => {
  // Business logic

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const gender = req.body.gender;
  const isActive = req.body.isActive;

  const created = await User.create({
    firstName,
    lastName,
    email,
    password,
    gender,
    isActive: true,
  });

  res.json({
    message: "User created successfully",
    data: created,
  });
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email, password, gender, isActive } = req.body;

    // 1️⃣ Fetch user first
    let user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: `User id=${id} not found`,
      });
    }

    // 2️⃣ Update user
    user = await user.update({
      firstName,
      lastName,
      email,
      password,
      gender,
      isActive,
    });

    // 3️⃣ Return updated user
    res.json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    let user = await User.findByPk(id);
    console.log("User", user);

    if (!user) {
      res.json({
        message: `User id=${id} not found`,
      });
    }

    await user.destroy();
    //  await User.destroy({
    //     where: {
    //       id
    //     }
    //   })

    res.json({
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error: ", error);
  }
});

module.exports = router;
