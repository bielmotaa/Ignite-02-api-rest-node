import { FastifyInstance } from 'fastify'
import { knex } from '../database.js'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdExist } from '../middlewares/check-session-id.js'

export async function transactionsRoutes(app: FastifyInstance) {
    // Essa funcao vai ser executada antes de todas as rotas
    // E um preHandler GLOBAL, ou seja, vai ser executado em todas as rotas
    // nele eu recebo o request e o response como parametro
    // Isso ajuda pras fazer validacoes globais
    // Ou seja, esse addHook ele eh global para minha 
    // funcao transactionsRoutes
    // Se eu quiser que ele seja global para todas as rotas da minha aplicacao
    // eu devo usar o app.addHook() fora da funcao transactionsRoutes la no meu 
    // server.ts onde eu registro as rotas
    // Se eu quiser que ele seja global apenas para uma rota especifica
    // eu devo usar o app.addHook() dentro da rota especifica
    app.addHook('preHandler', async (request, response) => {
        console.log(request.cookies)
    })

    // ROTA PARA LISTAR TRANSACOES
    // estou usando  a mesma rota / mas com o metodo get, so mudo o metodo
    app.get('/',
        // aqui eu passo o plugin que eu quero usar
        // o preHandler ele executa uma funcao antes da rota
        // ou seja antes de executar a rota, ele vai executar a funcao checkSessionIdExist
        // se a funcao retornar algo, a rota nao vai ser executada
        // se a funcao nao retornar nada, a rota vai ser executada
        {
            //ela ja vai receber o request e o response como parametro
            preHandler: checkSessionIdExist
        },
        async (request, response) => {

            const { sessionId } = request.cookies

            //.select('*') OU .select() ele retorna todos os campos da tabela
            const transactions = await knex('transactions')
                // filtro para retornar apenas as transacoes do usuario logado (ou seja, aquele que
                // tem o cookie igual que o meu request retorna)
                .where('session_id', sessionId)
                .select()
            // sempre que for retornar algo para o 
            // frontend eu devo retornar um objeto, melhor pra adcionar
            //  novos campos no futuro
            return {
                transactions
            }
        })


    // ROTA PARA BUSCAR UMA TRANSACAO ESPECIFICA
    app.get('/:id',  // aqui eu passo o plugin que eu quero usar
        // o preHandler ele executa uma funcao antes da rota
        // ou seja antes de executar a rota, ele vai executar a funcao checkSessionIdExist
        // se a funcao retornar algo, a rota nao vai ser executada
        // se a funcao nao retornar nada, a rota vai ser executada
        {
            //ela ja vai receber o request e o response como parametro
            preHandler: checkSessionIdExist
        }, async (request, response) => {

            const getTransactionParamsSchema = z.object({
                id: z.string().uuid(),
            })

            const { id } = getTransactionParamsSchema.parse(request.params)
            // esse .first() ele retorna apenas um registro, 
            // o primeiro que encontrar com esse valor.

            const { sessionId } = request.cookies

            const transaction = await knex('transactions')
                .where({
                    session_id: sessionId,
                    id,
                })
                .first()
            return {
                transaction
            }
        })

    //ROTA PARA SUMARIO DAS TRANSACOES
    app.get('/summary',
        // aqui eu passo o plugin que eu quero usar
        // o preHandler ele executa uma funcao antes da rota
        // ou seja antes de executar a rota, ele vai executar a funcao checkSessionIdExist
        // se a funcao retornar algo, a rota nao vai ser executada
        // se a funcao nao retornar nada, a rota vai ser executada
        {
            //ela ja vai receber o request e o response como parametro
            preHandler: checkSessionIdExist
        }, async (request, response) => {
            // esse .sum('amount', {as: 'amount'}) ele soma todos os valores da coluna amount
            // e retorna o resultado com o nome de amount
            // esse .first() ele retorna apenas um registro, 
            // o primeiro que encontrar com esse valor, EVITANDO RETORNAR UM ARRAY .

            const { sessionId } = request.cookies

            const summary = await knex('transactions')
                .where({
                    session_id: sessionId
                })
                .sum('amount', { as: 'amount' })
                .first()
            return {
                summary
            }
        })




    // ROTA PARA CRIAR TRANSACOES
    app.post('/', async (request, replay) => {

        // Definindo o schema da transacao - o que o frontend deve retornar 
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        // Validando o schema com o parse passando o request.body 
        // Se der errado ele para de executar 
        const { title, amount, type } = createTransactionBodySchema.parse(request.body)

        // pegando o cookie - ou seja a identificacao do usuario se ja existe ou nao
        // isso o proprio request ja traz pra mim
        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()
            //aqui eu crio o cookie e envio para o frontend, 
            // o cookie ele vai ficar salvo no navegador do usuario
            // e vai ser enviado para o servidor a cada requisicao

            //o replay ele e responsavel por enviar a resposta para o frontend
            //ele tem o metodo cookie() que serve para enviar cookies para o frontend
            replay.cookie('sessionId', sessionId, {
                path: '/', // o caminho que o cookie vai ser enviado - ou seja em todas as rotas
                // o maxAge ele define por quanto tempo o cookie vai ficar salvo no navegador do usuario
                // aqui no caso ele vai ficar salvo por 7 dias
                maxAge: 60 * 60 * 24 * 7 // 7 days - tempo que o cookie vai ficar salvo no navegador do usuario
            })
        }

        await knex('transactions').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            //salvo o id do cookie do usuario na coluna session_id
            session_id: sessionId,
        })

        // 201 - resource created
        // retorno pro frontend que deu certo
        // esse send() ele envia uma resposta vazia ou eu poderia colocar alfgo dentro send("deu bom")
        return replay.status(201).send()
    })
}