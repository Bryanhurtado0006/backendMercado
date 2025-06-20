import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { validarUsuario } from '../middlewares/validarUsuario.js';


const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
  

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ nombre, email, password: hashedPassword });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.get('/', async (req, res) => {
  try {
    console.log('Buscando usuarios...');
    const users = await User.find();
    console.log('Usuarios encontrados:', users);
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const updatedData = {
      ...(nombre && { nombre }),
      ...(email && { email }),
      ...(password && { password: hashedPassword })
    };

    const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

export default router;