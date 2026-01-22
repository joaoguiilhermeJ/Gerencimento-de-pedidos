import app from './app.js'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`\nServidor rodando: http://localhost:${PORT}`)
    console.log(`API: http://localhost:${PORT}/api\n`)
})
