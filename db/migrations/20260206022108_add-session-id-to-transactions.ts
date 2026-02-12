import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    // alterTable = alterar a tabela - eu posso alterar a tabela ja criada
    // para isso eu crio uma migration so pra alteracoes para nao usar a outra que serve pra criar a tabela

    //Aqui eu estou adicionando um novo campo na tabela transactions
    await knex.schema.alterTable('transactions', (table) => {
        // after('id') - informo o campo que eu quero adicionar 
        // depois do campo id
        // index() = criar um indice no campo - isso ajuda a velocidade da busca
        table.uuid('session_id').after('id').index() // after = depois do id // notNullable = nao pode ser nulo
    })
}


export async function down(knex: Knex): Promise<void> {
    //Aqui eu devo deletar o campo que eu adicionei - dou um dropColumn para deletar o campo
    // dropColumn = deletar o campo
    // session_id = nome do campo que eu quero deletar
    await knex.schema.alterTable('transactions', (table) => {
        table.dropColumn('session_id')
    })
}

