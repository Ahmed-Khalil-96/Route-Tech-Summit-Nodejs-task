import connection from '../../DB/connectionDB.js';
import { globalErrorHandling } from '../utils/globalErrorHandling.js';
import path from "path";
import * as routers from './index.Routes.js';

import dotenv from "dotenv";
import { AppError } from '../utils/errorClass.js';
dotenv.config({ path: path.resolve("config/.env") });

export const initiateApp = (app, express) => {
    const port = process.env.port;

    app.use(express.json());
    app.use("/auth",routers.authRouter)
    app.use("/user", routers.userRouter);
    app.use("/category", routers.categoryRouter);
    app.use("/task", routers.taskRouter);

    connection();

    app.use('*', (req, res, next) => {
        return next(new AppError("404 Page is not found ", 404));
    });

    app.use(globalErrorHandling);

    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};
