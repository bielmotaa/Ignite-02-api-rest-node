import type { Knex } from "knex";

//O up informar o que essa migration vai fazer
//Para rodar a migration, eu uso o comando: npm run knex -- migrate:latest
export async function up(knex: Knex): Promise<void> {
    //passo uma funcao chamdo table que vai servir para criar uma tabela
    await knex.schema.createTable('transactions', (table) => {
       table.uuid('id').primary(),
       table.text('title').notNullable() // NotNullable = nao pode ser nulo
       table.decimal('amount', 10, 2).notNullable() // decimal = numero com virgula // 10, 2 = 10 digitos e 2 casas decimais
       table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() // timestamp = data e hora // defaultTo = valor padrao // fn.now = data e hora atual // notNullable = nao pode ser nulo
    })
}

//O down informar o que essa migration vai desfazer 
//Para rodar o down, eu uso o comando: npm run knex -- migrate:rollback
//Mas eu so faco isso quando eu nao envio esse cod pra producao,
//eu nao posso desfazer as migrations, pq o cara ja 
//ta usando o banco de dado la com essa migration.
export async function down(knex: Knex): Promise<void> {
    //dropTable = deletar a tabela
    await knex.schema.dropTable('transactions')
}

