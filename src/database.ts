import setupKnex, { Knex } from 'knex'
import { env } from './env/index.js'
import 'dotenv/config'
// Ele retorna todas as variaveis de 
// ambientes do meu arquivo .env em process.env

// Configuracao do banco de dados
// Esse Knex eh uma Interface, logo eu defino que
// config vai ser do tipo Knex.Config e ter suas propriedades.

export const config: Knex.Config = {
    client: env.DATABASE_CLIENT, // tipo de banco de dados que vamos usar
    
    //PARA O BANCO DE DADOS SQLITE: COM O FILENAME, SE FOR O PG
    // EU CONFIGURO APENAS PASSANOD O ENV.DATABASE_URL DELE
    connection: 
        // Informacoes para conectar ao banco de dados
        // Que sao o host, usuario, senha, porta e nome do banco de dados...
        // No caso do sqlite so precisamos do nome  (pq eh um banco local)do arquivo onde vamos salvar o banco de dados
        // esse ! informar que nunca eh vazio o valor
       env.DATABASE_CLIENT === 'sqlite' 
       ? { filename: env.DATABASE_URL } 
       : { connectionString: env.DATABASE_URL } //nome do arquivo do banco de dados
    ,
    // por padrao todos os campos do banco vao ter valores nulos 
    // pois por padrao o sqlite nao preenche os campos com valores nulos com value.
    useNullAsDefault: true,
    // Configuracao das migrations
    //informo a extensao das migrations e o diretorio onde elas vao ficar
    migrations: {
        extension: 'ts',
        directory: './db/migrations'
    }
}

// Criando o knex - knex eh 
// a ferramenta que vamos usar 
// para interagir com o banco de dados
export const knex = setupKnex(config)