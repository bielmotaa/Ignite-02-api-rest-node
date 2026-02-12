import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
//esse execSync ele serve para eu executar comandos do terminal no node
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app.js'

//REGRAS - UM TESTE ELE NUNCA DEPENDE DE UM CONTEXTO OU REGRA OU DE OUTRO TESTE
// - 'AH! PRA LISTAR AS TRANSACOES EU PRECISO DE UM COOKIE.
//    COMO VOU CRIAR UM 
//    TESTER PRA LISTAR SEM PASSAR ESSE COOKIE?' 
// - Resposta : nao passa. Um teste nao pode depender de um contexto e se depender de outro teste, ele deve ser um unico test
// O test deve se adaptar ao teste e nao ao contrario

// Para rodar o teste :  npx vitest
// Eu posso deixar no meu package.json um script para rodar o teste mais facil, por exemplo: "test": "vitest" - ai basta rodar npm run test


// Tipos de teste:
// Testes unitários: testam uma única função ou componente isoladamente
// Testes de integração: testam a interação entre duas ou mais funções ou componentes
// Testes de ponta a ponta (E2E - End to End): testam todo o fluxo do usuário no sistema

// Devo usar o supertest para testar as rotas da minha API,
// ele me permite fazer requisições HTTP para o meu, sem eu
// precisar rodar o servidor de verdade, ou seja,
// ele simula as requisições para o meu
// servidor e verificar as respostas. Para isso,
// eu preciso instalar o supertest: npm install supertest
// npm install -D @types/supertest - para o supertest funcionar com typescript

//O teste eh composto por 3 etapas:
// O enunciado do teste: o que eu quero testar, ou seja, a funcionalidade que eu quero testar
// A execução do teste: o que eu preciso fazer para testar a funcionalidade, ou seja, os passos para realizar o teste
// A validação do teste: o que eu espero que aconteça depois de executar o teste, ou seja, o resultado esperado

//test = "teste" - ou seja, a funcao que define um teste
/* test('o usuario consegue criar uma nova transacao', () => {
    const responseStatus = 201

    //Expect = "eu espero que..." - ou seja, a validacao do teste
    // toEqual = "seja igual a..." - ou seja, o resultado esperado
    expect(responseStatus).toEqual(201)
})
*/


// beforeAll: Executa uma vez antes de começar qualquer teste deste arquivo.
// Usamos 'async/await' para garantir que o Node espere o Fastify carregar
// todos os plugins (Knex, Cookies, etc) e rotas antes de prosseguir.
// Ou seja usamos pra garantir que dependencias do knex, fastify, etc estejam carregadas antes de executar os testes
// essa funcao ela vai ser executada apenas uma vez

// beforeAll e afterAll: Ciclo Único. Rodam apenas UMA VEZ para o arquivo inteiro.
// Útil para configurações pesadas, como ligar e desligar o servidor (Setup e Teardown).

// beforeEach e afterEach: Ciclo Repetitivo. Rodam para CADA teste (it/test) individualmente.
// Útil para garantir que cada teste comece do zero (ex: limpar o banco entre testes).
// Executa uma vez antes de cada teste.
// Se você tiver um arquivo com 3 testes (it), o beforeEach vai trabalhar 3 vezes.

// Describe = "descrever" - ou seja, a descricao do teste - sao categorias 
// Cada  test ou (it) eh uma funcionalidade que eu quero testar
describe('Transactions routes', () => {

    beforeAll(async () => {
        // ready() = essa funcao ela vai garantir que o fastify carregue todas as rotas e plugins antes de executar os testes
        // Aqui eu espero minha aplicacao carregar completamente (suas rotas e plugins) antes de executar os testes
        await app.ready()
    })

    afterAll(async () => {
        // close() = essa funcao ela vai garantir que o fastify feche todas 
        // as rotas e plugins depois que os testes acabarem de executar e limpa o servidor criado na memoria

        // pois
        // Se você rodar o Vitest no modo watch (aquele que fica esperando você salvar o arquivo para rodar de novo), 
        // e você não tiver o app.close(), cada vez que você salvar o arquivo, um "novo" servidor vai ser criado na memória, 
        // mas o "antigo" vai continuar lá.
        // Depois de 10 salvamentos, você terá 10 instâncias do seu app ocupando sua memória RAM como se fossem fantasmas.

        await app.close()
    })

    //Eu sempre devo garantir, que pra cada test, o meu banco de dados seja limpo e atualizado com 
    //as migrations - ou seja, devo pra cada teste limpar e gerar as tabelas do banco de dados
    beforeEach(async () => {
        // Desfaz todas as migrations - gero meu banco 
        execSync('npm run knex migrate:rollback --all')
        // Aqui eh o seguinte : COMO eu to rodando o meu test em um banco separado do de producao
        // Quando eu for rodar esse banco eu devo gerar as migrations dessa banco antes dos meus teste para eles 
        // Terem acesso as tabelas do banco de dados
        // O comando 'migrate:latest' cria todas as tabelas automaticamente no banco de teste.
        // Crio as migrations do banco de teste - ou seja, crio o banco de novo
        execSync('npm run knex migrate:latest')
    })

    it('user can create a new transaction', async () => {
        // App.server: Fornece a instância nativa do servidor HTTP do Node.js que o Fastify usa por baixo dos panos.
        // O supertest (request) precisa dessa instância para simular requisições HTTP reais sem precisar
        // De um servidor rodando fisicamente em uma porta (ex: localhost:3333).
        const response = await request(app.server)
            .post('/transactions')
            .send({ //send serve para enviar os valores para a rota a cima
                title: 'New transaction',
                amount: 5000,
                type: 'credit'
            })
            //expect(201) = "eu espero que o status code seja 201" - ou seja, o resultado esperado
            .expect(201)
        //aqui eu faco a validacao do teste - ou seja, o que eu espero que aconteca
        //response.statusCode = o status code da resposta
        //toEqual = "seja igual a..." - ou seja, o resultado esperado
        // expect(response.statusCode).toEqual(201)


        //Recuperando o cookie da resposta
        console.log(response.get('Set-Cookie'))
    })

    // should = deve
    // be  = ser
    // able = capaz
    // to = de ou para 
    // list = listar
    // all = todas
    // transactions = transacoes
    // Ou seja: "deve ser capaz de listar todas as transacoes"

    //it.skip = pular o teste
    //it.todo = ele nao executa, quando eu rodo os teste ele aparece 
    //como pendente - serve pra eu lembrar de fazer o teste depois
    //it.only = executa apenas um teste e pula todos os outros
    it('should be able to list all transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({ //send serve para enviar os valores para a rota a cima
                title: 'New transaction',
                amount: 5000,
                type: 'credit'
            })
        // recuperando o cookie da resposta - 
        // pra listar antes eu devo criar uma transacao
        const cookies = createTransactionResponse.get('Set-Cookie')

        if (!cookies) {
            //caso nao encontre o cookie, ele vai lancar um erro
            throw new Error('Cookies not found')
        }

        //aqui eu estou retornando todos os calores do usuario com esse cookie
        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            // O .set() (.set('Cookie', ja eh da propria documentacao) 
            // envia informações extras no cabeçalho da requisição.
            // Aqui, estamos enviando o cookie de identificação para o servidor 
            // saber de qual usuário ele deve listar as transações.
            // Ele só vai retornar as transações desse usuário.
            .set('Cookie', cookies) //verificacao do cookie
            .expect(200)

        // Aqui validamos se o corpo da resposta (body) contém a lista de transações esperada.
        // esse meu listTransactionsResponse retorna um objeto body e dentro dele
        // tem um array transactions
        // toEqual([...]): Esperamos um array.
        // expect.objectContaining: Não precisamos validar todos os campos (como ID ou data), 
        // apenas os campos que enviamos, garantindo que os dados básicos estão corretos
        expect(listTransactionsResponse.body.transactions).toEqual([
            // ANALOGIA DO MARTELO:
            // Imagine que você comprou uma caixa com 50 ferramentas.
            // O 'objectContaining' diz: "Não me importa se vieram 50 itens, eu só quero 
            // conferir se o Martelo e a Chave de Fenda estão lá dentro".

            expect.objectContaining({
                // O ID é como o 'Número de Série' do martelo: 
                // Eu não sei qual é o número agora, mas eu exijo que seja um Texto (String).
                id: expect.any(String),

                // O Título e o Valor são as características que eu escolhi:
                title: 'New transaction',
                amount: 5000,
            })
        ])
    })

    // should = deve
    // be = ser
    // able = capaz
    // to = de / para (conector)
    // get = obter / buscar
    // a = uma
    // specific = específica
    // transaction = transação
    it('should be able to get a specific transaction', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit'
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        if (!cookies) {
            throw new Error('Cookies not found')
        }

        //Aqui eu estou retornando todos os calores do usuario com esse cookie
        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)

        //vou pegar o id da primeira transacao retornada pelo listTransactionsResponse
        const transactionId = listTransactionsResponse.body.transactions[0].id

        //aqui eu estou retornando a transacao desse id (o da primeira)
        const getTransactionResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200)

        //o que eu espero que seja retornado 
        expect(getTransactionResponse.body.transaction).toEqual(
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            })
        )
    })

    // should = deve
    // be = ser
    // able = capaz
    // to = de / para
    // get = obter / pegar
    // the = o / a
    // summary = resumo (no seu caso, o saldo/balanço total)

    //Para o resumo eu vou criar duas transacoes
    it('should be able to get the summary', async () => {
        // 1. Criamos uma transação de CRÉDITO (Entrada)
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'Credit transaction',
                amount: 5000,
                type: 'credit'
            })

        // Capturamos o cookie para manter a "sessão" do usuário
        const cookies = createTransactionResponse.get('Set-Cookie')

        if (!cookies) {
            throw new Error('Cookies not found')
        }

        // 2. Criamos uma transação de DÉBITO (Saída) usando o MESMO cookie
        await request(app.server)
            .post('/transactions')
            //esse set serve para enviar informações extras no cabeçalho da requisicao
            .set('Cookie', cookies) //eu reaproveito o cookie da primeira requisicao - Essencial para o servidor saber que é o mesmo usuário
            .send({
                title: 'Debit transaction',
                amount: 2000,
                type: 'debit'
            })

        // 3. Chamamos a rota de RESUMO (Summary)
        const summaryResponse = await request(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies) //retorno quem tem esse cookie
            .expect(200)

        // 4. A VALIDAÇÃO: 5000 (Crédito) - 2000 (Débito) deve ser igual a 3000
        expect(summaryResponse.body.summary).toEqual({
            amount: 3000,
        })
    })
})