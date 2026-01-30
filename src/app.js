import express from 'express'
import sequelize from './config/database.js'
import routes from './routes/index.routes.js'
import { tratarErros, rota404 } from './middlewares/error.middleware.js'

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import * as pedidosService from './services/pedidos.service.js'
import * as produtosService from './services/produtos.service.js'
import * as clientesService from './services/clientes.service.js'
import ejs from 'ejs'

const app = express()

// Configurar EJS para processar arquivos .html
app.set('view engine', 'html')
app.engine('html', ejs.renderFile)
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Servir arquivos estáticos (CSS, JS, Imagens)
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/js', express.static(path.join(__dirname, 'public/js')))
app.get('/favicon.ico', (req, res) => res.status(204).end())

sequelize.sync()
    .then(() => console.log(' Banco de dados sincronizado'))
    .catch(err => console.error(' Erro ao sincronizar banco de dados:', err))

app.use('/api', routes)

// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('index.html')
})

// Rotas para as visualizações de Pedidos
app.get('/pedidos', async (req, res) => {
    try {
        const pedidos = await pedidosService.listar_pedidos()
        res.render('pedidos/listar.view.html', { pedidos })
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.get('/pedidos/novo', async (req, res) => {
    try {
        const produtos = await produtosService.listar_produtos()
        const clientes = await clientesService.listar_clientes()
        res.render('pedidos/cadastrar.view.html', { produtos, clientes })
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.get('/pedidos/:id', async (req, res) => {
    try {
        const id = req.params.id
        const pedido = await pedidosService.buscar_pedido(id)
        // Você pode precisar buscar os itens separadamente se o service não trouxer
        res.render('pedidos/detalhes.view.html', { pedido, itens: pedido.itens || [] })
    } catch (err) {
        res.status(404).send('Pedido não encontrado')
    }
})

// Rotas para as visualizações de Produtos
app.get('/produtos', async (req, res) => {
    try {
        const produtos = await produtosService.listar_produtos()
        res.render('produtos/listar.view.html', { produtos })
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.get('/produtos/novo', (req, res) => {
    res.render('produtos/cadastrar.view.html')
})

app.get('/produtos/:id/editar', async (req, res) => {
    try {
        const produto = await produtosService.buscar_produto(req.params.id)
        res.render('produtos/editar.view.html', { produto })
    } catch (err) {
        res.status(404).send('Produto não encontrado')
    }
})

// Rotas para as visualizações de Clientes
app.get('/clientes', async (req, res) => {
    try {
        const clientes = await clientesService.listar_clientes()
        res.render('clientes/listar.view.html', { clientes })
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.get('/clientes/novo', (req, res) => {
    res.render('clientes/cadastrar.view.html')
})

app.get('/clientes/:id/editar', async (req, res) => {
    try {
        const cliente = await clientesService.buscar_cliente(req.params.id)
        res.render('clientes/editar.view.html', { cliente })
    } catch (err) {
        res.status(404).send('Cliente não encontrado')
    }
})

// Rota para a visualização de Itens (Histórico)
app.get('/itens', async (req, res) => {
    try {
        const itens = await pedidosService.listar_itens()
        res.render('itens/listar.view.html', { itens })
    } catch (err) {
        res.status(500).send(err.message)
    }
})



app.use(rota404)

app.use(tratarErros)

export default app
