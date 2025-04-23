import mongoose from "mongoose";

 const URI = "mongodb+srv://20233tn111:azB3acGGi0wRLh7p@practica.m6rej.mongodb.net/IntegradoraOriginal?retryWrites=true&w=majority&appName=Practica"; //servidor de datos local


 //const URI='mongodb+srv://prueba:prueba@cluster0.ekq1p.mongodb.net/codigokiss' //servicio externo



export const connectDB = async () => {
  try {
    const db = await mongoose.connect(URI);
    console.log(`base de datos conectada  ${db.connection.name}`);
  } catch (error) { //En caso de no tener exito en la conexion
    console.log(`error al conectar a la base de datos ${error.message}`);
  }
};

