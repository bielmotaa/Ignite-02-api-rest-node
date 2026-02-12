import { config } from 'dotenv'
import { z } from 'zod'

// O Vitest (e quase todos os frameworks de teste) preenche a variável 
// 'NODE_ENV' com o valor 'test' automaticamente quando você roda os testes.

/*
  O que o config() faz?
  O computador, por padrão, não sabe ler o arquivo .env. Ele ignora esse arquivo. 
  Quando você chama o config(), acontece o seguinte:

  1. Ele abre o arquivo .env (ou o arquivo que você indicou no path).
  2. Lê as linhas de configuração (ex: DATABASE_URL="./db/app.db").
  3. Pega essa informação e coloca dentro de um objeto global do Node.js chamado 'process.env'.

  Sem o config(), o seu código não conseguiria acessar nenhuma senha, porta ou 
  URL de banco de dados que está guardada no arquivo secreto.
*/

if (process.env.NODE_ENV === 'test') {
    // Se estivermos em ambiente de teste:
    // Carregamos as variáveis do arquivo '.env.test' para não sujar 
    // ou apagar os dados do nosso banco de dados principal.
    // vai ser criado um banco de dados separado para os testes em db - migrations
    config({
        path: '.env.test'
    })
} else {
    // Se estivermos rodando o app normalmente (npm run dev):
    // Carregamos o arquivo '.env' padrão.
    config()
}

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_URL: z.string(),
    //Esse pg eh o 
    // nome do cliente de banco de dados 
    // que vamos usar : que eh o postgres
    //aqui eu to informando qual banco de dados
    // vamos usar, no caso o sqlite ou o pg
    // nisso se eu usar o pg, eu preciso instalar
    //  o pg : npm install pg
    DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
    PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    console.error('⚠️ Invalid environment variables', _env.error.format())

    throw new Error('Invalid environment variables.')
}

export const env = _env.data