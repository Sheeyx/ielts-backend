import express from "express";
import path from "path";
import router from "./router";
import cookieParser from 'cookie-parser';
import session from "express-session";
import { T } from "./libs/types/common";
import cors from "cors";
import ConnectMongoDB from "connect-mongodb-session";



const MongoDBStore = ConnectMongoDB(session);

const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL),
    collection: "sessions",
  });

/** 1-ENTRANCE */
const app = express();
console.log("dirname",__dirname);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: true}))
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads",express.static("./uploads"));

/** 2-SESSIONS */

app.use(
    session({
        secret: String(process.env.SESSIONS_SECRET),
        cookie: {
            maxAge: 1000 * 3600 * 3, //3h
        },
        store: store,
        resave: true,
        saveUninitialized: true,
    })
);

app.use(function(req,res,next){
    const sessionInstance = req.session as T;
    res.locals.member = sessionInstance.member;
    next();
})

/** 3-VIEWS */
app.set('views', path.join(__dirname, "views"));
app.set('view engine', "ejs");

/** 4-ROUTERS */ 

app.use("/",router);

export default app;  