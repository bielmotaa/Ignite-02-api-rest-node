// Arquivo Definicao de tipos - D-TS
// Ignorar erro

// eslint-disable-next-line 
import { Knex } from 'knex'

// esse 'knex/type/tables' ele sobrescreve o tipo de tabelas do knex 
// nos codigos onde eu chamar o meu knex ele vai entender que
// eu estou usando a tabela transactions
// e vai me dar o autocompletar com os campos da tabela transactions ja definadas 
declare module 'knex/type/tables' {
    export interface Tables {
        transactions: {
            id: string
            title: string
            amount: number
            //    type: 'credit' | 'debit'
            created_at: string
            session_id: string
        }
    }
}
