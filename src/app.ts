// 1️⃣ IMPORTAR = Trazer algo de fora para usar aqui
//    "fastify" é uma ferramenta que cria um servidor web (como um garçom que atende pedidos na internet)
//  Um microframework web rápido e minimalista para Node.js
import fastify from 'fastify'
import { knex } from './database.js'
import { kMaxLength } from 'node:buffer'
import crypto from 'node:crypto'
import { env } from './env/index.js'
import { transactionsRoutes } from './routes/transactions.js'
import cookie from '@fastify/cookie'


// 2️⃣ CRIAR O APLICATIVO = Pegar a ferramenta e preparar ela para funcionar
//    "app" é o nome que damos ao nosso servidor (como dar nome a um robô)
export const app = fastify()

// AQUI EU REGISTRO O PLUGIN DE COOKIES NO MEU SERVIDOR
// O app.register() é o coração da arquitetura do Fastify. 
// Imagine que o Fastify é uma peça de LEGO básica: 
// ele sozinho não faz quase nada. O register é a 
// forma de você "encaixar" novas peças e funcionalidades nele.
app.register(cookie)


// CRIACAO COM PLUGINS - COMO SE EU FOSSE COMPONETIZAR MINHAS FUNCIONDALIDADE PARA NAO DEIXAR TUDO EM UM UNIDCO ARQUIVO
// Evita o "código macarrão", separando as funcionalidades em arquivos diferentes.
// ESSE register = registro as funcionalidades em arquivos diferentes.
// Eles devem sempre seguir uma ordem logica
app.register(transactionsRoutes, {
  // prefix = prefixo que eu quero adicionar a todas as rotas - ou seja minha rota url
  // ex: http://localhost:3333/transactions
  // ai la basta colocar apenas /
  prefix: '/transactions'
})

// 3️⃣ CRIAR UMA ROTA = Dizer o que o servidor faz quando alguém visita um endereço
//    - app.get = "quando alguém PEDIR algo (como fazer uma pergunta)"
//    - '/hello' = o endereço que a pessoa visita (ex: http://localhost:3333/hello)
//    - async () => { } = uma função que diz "o que devolver" para quem acessou
//    - return { message: 'Hello World' } = devolver uma mensagem em formato JSON
/* app.get('/hello', async () => {

  // Vou consultar uma tabela do banco de dados - essa tabela eh criada automaticamente pelo knex (so pra testar)
  // const tables = await knex('sqlite_schema').select('*')
  // return tables


  // ##Inserindo dados na tabela transactions
 
  const transaction = await knex('transactions').insert({
    id: crypto.randomUUID(),
    title: 'Transaction test',
    amount: 1000,
    created_at: new Date(),
  }).returning('*') 
  // returning('*') = retorna todos os campos da tabela inseridos no banco de dados
  return transaction
 

  // ##Consultando dados na tabela transactions
  // uso o select('*') para buscar todos os campos da tabela transactions
  const transactions = await knex('transactions')
    //.where('amount', 1000) = posso fazer filtros de busca, aqui no caso eu busco pelo amount igual a 1000
    .select('*')
  return transactions
})
*/
