/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * KNEXFILE.TS - O "Mapa de Navegação" do Knex.js
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * 🎯 PARA QUE SERVE ESTE ARQUIVO?
 *
 * O knexfile é o ponto de entrada que o Knex CLI procura automaticamente quando
 * você executa comandos no terminal como:
 *   - npx knex migrate:latest    (aplica todas as migrations pendentes)
 *   - npx knex migrate:make nome (cria uma nova migration vazia)
 *   - npx knex seed:run          (executa os seeds do banco)
 *   - npx knex migrate:rollback  (desfaz a última migration)
 *
 * O Knex CLI NÃO usa o seu database.ts diretamente. Ele procura por um arquivo
 * chamado "knexfile" (knexfile.js ou knexfile.ts) na raiz do projeto. Por isso
 * este arquivo existe: para "conectar" o CLI à sua configuração de banco.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 📚 CONCEITO IMPORTANTE: Separação de Responsabilidades
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * - src/database.ts → Usado pela SUA APLICAÇÃO (quando o servidor Node sobe)
 * - knexfile.ts     → Usado pelo KNEX CLI (quando você roda comandos no terminal)
 *
 * Ambos precisam da mesma configuração (client, connection, etc), então ao invés
 * de duplicar o código, importamos o config do database.ts e reexportamos aqui.
 * DRY = Don't Repeat Yourself!
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * ⚠️ POR QUE "./src/database.js" E NÃO "./src/database.ts"?
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * O Knex CLI pode rodar o arquivo compilado (JavaScript) ou via ts-node/tsx.
 * Se o seu projeto compila TypeScript para a pasta dist/, o CLI geralmente
 * trabalha com os arquivos .js compilados. Se usar ts-node ou tsx no script
 * do knex, aí sim usaríamos .ts. Ajuste conforme seu setup!
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { config } from "./src/database.js";
export default config;
//# sourceMappingURL=knexfile.d.ts.map