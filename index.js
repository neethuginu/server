
// express import
const express = require('express');
const session = require('express-session');
const cors=require('cors');


const dataService = require('./services/data.service');

// assign express in variable app
const app = express();

app.use(cors({
    origin:'http://localhost:4200',
    credentials:true
}))
app.use(session({
    secret: 'randomsecurestring',
    resave: false,
    saveUninitialized: false
}))
const logMiddleware = ((req, res, next) => {
    console.log(req.body);
    next()
})


const authMiddleware = (req, res, next) => {
    if (!req.session.currentUser) {
        return res.json({
            status: false,
            statusCode: 422,
            message: "please login"
        })
    }
    else {
        next();
    }
}

app.use(express.json());


app.get('/', (req, res) => {
    res.send('GET METHOD')
}),
    app.post('/register', (req, res) => {
        // console.log(req.body);
        dataService.register(req.body.acno, req.body.username, req.body.password)
            .then(result => {
                res.status(result.statusCode).json(result)
            })

    })
app.post('/login', (req, res) => {
    // console.log(req.body);
  dataService.login(req, req.body.acno, req.body.password)
  .then(result=>{res.status(result.statusCode).json(result)})
    
})


    app.post('/deposit', authMiddleware, (req, res) => {
       
     dataService.deposit(req.body.acno, req.body.password, req.body.amnt)
     .then(result=>{res.status(result.statusCode).json(result)})
       
    })

app.post("/withdraw", authMiddleware, (req, res) => {
     dataService.withdraw(req,req.body.acno, req.body.password, req.body.amnt)
     .then(result=>{res.status(result.statusCode).json(result)})
   
})


    app.post('/', (req, res) => {
        res.send('POST METHOD')
    }),


    app.put('/', (req, res) => {
        res.send('PUT METHOD')
    }),
    app.patch('/', (req, res) => {
        res.send('PATCH METHOD')
    }),
    app.delete('/', (req, res) => {
        res.send('DELETE METHOD')
    }),
    // port specify 
    app.listen(3000, () => {
        console.log("server started at port 3000")
    });
