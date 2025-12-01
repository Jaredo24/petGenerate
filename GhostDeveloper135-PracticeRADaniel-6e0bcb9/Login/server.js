const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// Cargar usuarios desde users.json
function loadUsers() {
  let data = fs.readFileSync("users.json");
  return JSON.parse(data);
}

// Guardar usuarios
function saveUsers(users) {
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

// Ruta de registro
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  let users = loadUsers();

  const userExists = users.find(u => u.username === username);

  if (userExists) {
    return res.json({ success: false, message: "El usuario ya existe" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ username, password: hashedPassword });
  saveUsers(users);

  res.json({ success: true, message: "Usuario registrado correctamente" });
});

// Ruta de login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  let users = loadUsers();

  const user = users.find(u => u.username === username);

  if (!user) {
    return res.json({ success: false, message: "Usuario no encontrado" });
  }

  const validPass = await bcrypt.compare(password, user.password);

  if (!validPass) {
    return res.json({ success: false, message: "Contraseña incorrecta" });
  }

  res.json({ success: true, message: "Inicio de sesión exitoso" });
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});
