const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 10000;
const {MONGOURI} = require('./config/keys');


// on connection, log message to the console
mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

mongoose.connection.on('connected',()=>{
    console.log("MONGODB CONNECTED");
    
})

// export the models
require('./models/user');
require('./models/post');

// register routes
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req, res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    });
}

// on error, log error to the console
mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err);
    
})

// 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
// "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"



app.listen(PORT, ()=>{
    console.log(`server currently running on port ${PORT}`);
})