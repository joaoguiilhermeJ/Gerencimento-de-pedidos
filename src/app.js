import express from 'express'
import sequelize from './config/database.js'
import routes from './routes/index.routes.js'
import { tratarErros, rota404 } from './middlewares/error.middleware.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

sequelize.sync()
    .then(() => console.log(' Banco de dados sincronizado'))
    .catch(err => console.error(' Erro ao sincronizar banco de dados:', err))

app.use('/api', routes)

app.use(rota404)

app.use(tratarErros)

export default app
