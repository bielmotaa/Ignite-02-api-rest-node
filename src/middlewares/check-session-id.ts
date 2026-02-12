//middlewares = sao funcoes que sao executadas antes de uma rota
// Ideia de preHandler = sao funcoes que sao executadas antes de uma rota e podemos compartilhar regras 
// de negocio entre as rotas
import { FastifyReply, FastifyRequest } from "fastify";

export async function checkSessionIdExist(
    request: FastifyRequest,
    reply: FastifyReply
) {

    //  Recupero o cookie do usuario - SEMPRE VAI SER UM 
    //  COOKIE PARA CADA NAVEGADOR, SEU EU CRIAR outra
    //  transacao em outro navegador ele vai criar
    //  outro cookie, mas se eu criar 1 ou 2 ou mil
    //  transacoes no mesmo navegador ele vai criar
    //  apenas um id de cookie
    //  Teoricamente o usuario sempre tera um cookie quando ele eh criado,
    //  mas caso ele nao tenha eu retorno um erro

    const sessionId = request.cookies.sessionId

    if (!sessionId) {
        return reply.status(401).send({
            error: 'Unauthorized'
        })
    }

}