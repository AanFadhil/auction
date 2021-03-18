const path = require('path')
const dotenv = require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const log = require('./logger')
const utilities = require('./utils/utilities')
const chalk = require('chalk')

//routes import
const authRoutes = require('./controllers/auth')
const itemRoutes = require('./controllers/item')
const bidRoutes = require('./controllers/bid')
const settingsRoutes = require('./controllers/settings')


log.info(chalk.blueBright('app starting'))

const app = express()

app.use(cors())
app.use(helmet())

app.use('/static', express.static(path.join(__dirname, 'public/static')));


app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

app.use(express.json())
app.use('/auth', authRoutes)
app.use('/item', itemRoutes)
app.use('/bid', bidRoutes)
app.use('/settings', settingsRoutes)


if (process.env.NODE_ENV !== "production")
    process.on('warning', e => console.warn(e.stack))



mongoose
    .connect(
        process.env.MONGO_CONNECTION_STRING
        , { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(result => {
        const port = process.env.port || 5000
        var http = require('http').createServer(app);
        
        http.listen(port, () => log.info(`api is listening to port ${port}`));
    })
    .catch(err => log.error(err));