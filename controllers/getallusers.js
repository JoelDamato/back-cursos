const User = require('../models/Users');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).lean(); // 👈 Trae TODOS los campos del schema

    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

module.exports = getAllUsers;
