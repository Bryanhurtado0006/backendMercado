import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/temp.js'; 
import { MongoClient } from 'mongodb';

const app = express();
app.use(express.json());


app.use('/api/users', userRoutes);

app.get("/",(req,res)=>{
  res.send("Bienvenido");
});


mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,

})
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión:', err));


app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${process.env.PORT}`);
});