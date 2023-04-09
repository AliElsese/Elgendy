const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config({path: './config.env'});
const dbConnection = require('./server/database/connection');

const ApiError = require('./server/utils/apiError');
const errorMiddleware = require('./server/middlewares/error-middleware');
const headersMiddleware = require('./server/middlewares/headers-middleware');

const authRoute = require('./server/routes/auth-route');
const userRoute = require('./server/routes/user-route');
const companyRoute = require('./server/routes/company-route');
const buyRoute = require('./server/routes/buy-route');
const productRoute = require('./server/routes/product-route');
const storeRoute = require('./server/routes/store-route');
const saleRoute = require('./server/routes/sale-route');

dbConnection();

const app = express();

app.use(express.json());
app.use(headersMiddleware.setHeaders);
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname , 'uploads')))

app.use('/auth' , authRoute);
app.use('/users' , userRoute);
app.use('/companies' , companyRoute);
app.use('/buyInvoice' , buyRoute);
app.use('/products' , productRoute);
app.use('/store' , storeRoute);
app.use('/saleInvoice' , saleRoute);
app.all('*' , (req , res , next) => {
    next(new ApiError(`Can't Find This Route: ${req.originalUrl}` , 400));
});

// ----------------------------
__dirname = path.resolve();
app.use(express.static(path.join(__dirname , '/client/build')));
app.get('*' , (req,res) => {
    res.sendFile(path.resolve(__dirname , 'client' , 'build' , 'index.html'))
})

// ----------------------------
app.use(errorMiddleware);

const PORT = process.env.PORT || 8101;
app.listen(PORT, function() {
    console.log(`Server Running on http://localhost:${PORT}`);
});