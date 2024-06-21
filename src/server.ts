import dotenv from "dotenv";
dotenv.config();
import app from './app';

import mongoose from "mongoose";

mongoose
.connect(process.env.MONGO_URL as string, {})
.then((data)=>{
    console.log("MongoDB connnection succeed");
    const PORT = process.env.PORT ?? 7001;
    app.listen(PORT, function(){
        console.info(`The server is running successfully on port: ${PORT}`);
        console.info(`Admin project on http://localhost:${PORT} \n`);
        
        
    })
    
})
.catch(err => console.log("ERROR on connenction MongoDB",err));