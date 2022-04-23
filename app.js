const path = require('path');

const fileUpload = require('express-fileupload');
const express = require('express');
const bodyParser = require('body-parser');
const productController = require('./controllers/products')
const app = express();
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session)

const MONGO_DB_URI = 
`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.e0ydi.mongodb.net/firmwaredb?retryWrites=true&w=majority`

const store = new MongoDbStore({
    uri : MONGO_DB_URI,
    collection : 'sessions'
})

app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin');
const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');
const { collection } = require('./models/product');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store : store
}))



app.use(fileUpload({
    createParentPath: true
}));

app.use('/admin', adminRoutes);
app.use(mainRoutes);
app.use(authRoutes);
app.use(productController.pageNotFound);

mongoose
.connect(MONGO_DB_URI)
.then(result=>{
    app.listen(process.env.PORT || 3000)
}).catch(err=>{
    console.log(err)
})


