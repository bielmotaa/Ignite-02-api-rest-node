import { app } from './app.js'
import { env } from './env/index.js'

// 4️⃣ LIGAR O SERVIDOR = Colocar o servidor para funcionar de verdade
//    - port: 3333 = a "porta" é como o número do quarto do servidor (3333 = quarto 3333)
//    - .then() = "quando terminar de ligar, faça isso..."
//    - console.log = mostrar uma mensagem no terminal (para nós sabermos que está funcionando)
app.listen({ port: env.PORT }).then(() => {
  console.log(`HTTP server running on http://localhost:${env.PORT}`)
})


// Cookies - sao pequenos arquivos que o servidor envia para o navegador
// e o navegador envia de volta para o servidor a cada requisicao.
// Eles sao usados para armazenar informacoes sobre o usuario, como preferencias, carrinho de compras, etc.
// Para usar cookies no fastify, eu preciso instalar o plugin fastify-cookie
// npm install fastify-cookie


//PQ EU SEPAREI O APP DO SERVER?
// - Quando eu for fazer um teste automatizado, 
// eu nao quero ligar o servidor de verdade, 
// porque isso pode causar problemas 
// (como conflitos de porta, ou lentidao nos testes).
// - Separando o app do server, eu posso importar e usar minhas rotas sem preciar subir a porta do servidor