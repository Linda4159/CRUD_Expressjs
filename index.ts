import { error } from "console";
import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";

const port: Number = 9500;
const url: string = "mongodb://0.0.0.0:27017/management";
const app: Application = express();

interface client {
  name: string;
  email: string;
  isActive: boolean;
  age: number;
}

interface iClient extends client, mongoose.Document {}

const schemaClient = new mongoose.Schema({
  name: {
    type: String,
  },
  isActive: {
    type: Boolean,
  },
  age: {
    type: Number,
  },
});

app.use(express.json());
const dataModel = mongoose.model<iClient>("client", schemaClient);

app.post("/api/v1/post-client", async (req: Request, res: Response) => {
  try {
    const { name, email, isActive, age } = req.body;
    if (!name || !email || (isActive && !isActive) || !age) {
      return res.status(404).json({
        message: "all fields required",
      });
    }
    const data = await dataModel.create({
      name,
      email,
      isActive,
      age,
    });
    return res.status(201).json({
      message: "created successfully",
      result: data,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: error.message,
    });
  }
});
app.get("/api/v1/get-all", async (req: Request, res: Response) => {
  try {
    const dataAll = await dataModel.find();
    return res.status(200).json({
      message: "all data",
      result: dataAll,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: error.message,
    });
  }
});
// app.delete("/api/v1/delete-client/:id",async(req:Request,res:Response)=>{
//     try{
//         const deleteClient = req.params.id
//         const ClientID =await dataModel.findByIdAndDelete
//         console.log(ClientID)
//         if(!ClientID){
// return res.status(404).json({
//     message:"incorrect client id"
// })
//         }
//         return res.status(200).json({
//             message:"client successfully deleted",
//             result: ClientID
            

//         })
        
        

//     }catch(error){
// return res.status(404).json({
//     message:"wrong url"
// })
//     }
// });
app.delete("/api/v1/delete-client/:id", async (req:Request,res:Response)=>{
    try{
    const ClientID =req.params.id
    const deleteClient = await dataModel.findByIdAndRemove(ClientID).exec()
    return res.status(200).json({
        success:1,
        message:"successfully deleted"
    })
        }catch(error){
return res.status(404).json({
    message:"check your id"
})
    }
})
app.put("/api/v1/update-client/:id",async(req:Request,res:Response)=>{
    const updateData = await dataModel.findByIdAndUpdate(req.params.id,req.body)
    try{
return res.status(200).json({
    success:1,
    message:"data successfully updated",
    data:updateData
})
    }catch(err){

    }
})
mongoose
  .connect(url)
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((error: any) => {
    console.log("an error occurred", error);
  });

const server = app.listen(port, () => {
  console.log("this is port", port);
});

process.on("uncaughtException", (error: Error) => {
  console.log("stop here:unCaughtException");
  console.log(error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.log("stop here:unhandleRejection");
  console.log(reason);

  server.close(() => {
    process.exit(1);
  });
});
