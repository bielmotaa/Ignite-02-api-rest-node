// 1️⃣ IMPORTAR = Trazer algo de fora para usar aqui
//    "fastify" é uma ferramenta que cria um servidor web (como um garçom que atende pedidos na internet)
import fastify from 'fastify';
// 2️⃣ CRIAR O APLICATIVO = Pegar a ferramenta e preparar ela para funcionar
//    "app" é o nome que damos ao nosso servidor (como dar nome a um robô)
const app = fastify();
// 3️⃣ CRIAR UMA ROTA = Dizer o que o servidor faz quando alguém visita um endereço
//    - app.get = "quando alguém PEDIR algo (como fazer uma pergunta)"
//    - '/hello' = o endereço que a pessoa visita (ex: http://localhost:3333/hello)
//    - async () => { } = uma função que diz "o que devolver" para quem acessou
//    - return { message: 'Hello World' } = devolver uma mensagem em formato JSON
app.get('/hello', async () => {
    return { message: 'Hello World' };
});
// 4️⃣ LIGAR O SERVIDOR = Colocar o servidor para funcionar de verdade
//    - port: 3333 = a "porta" é como o número do quarto do servidor (3333 = quarto 3333)
//    - .then() = "quando terminar de ligar, faça isso..."
//    - console.log = mostrar uma mensagem no terminal (para nós sabermos que está funcionando)
app.listen({ port: 3333 }).then(() => {
    console.log('HTTP server running on http://localhost:3333');
});
//# sourceMappingURL=server.js.map