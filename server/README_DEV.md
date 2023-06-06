# **Framework**

- ## **Fastify**

# **Dependencias em desenvolvimento**

- ## **Typescript**
    
    Ferramenta para colocar tipagem estática no projeto

- ## **Types/node**

    Para que o typescript entenda que esta em um projeto node, como em algumas importações de biblioteca nativas do node.

    Para configurar o typescript é preciso rodar


    ```bash
    npx tsc --init
    ```

    Esse comando cria um arquivo tsconfig.json, ele tem as configuraões do typescript no projeto

    Mude o modulo es2016 para es2020, essa versão o node ja aceita.

- ## **tsx**

    tsx vai automanticamente mudar o codigo de typescript para javascript

Crie uma pasta SRC dentro dela crie um arquivo server.ts.
Mude as configurações do package.json para compilar com o script run watch dev 

```conf
"dev": "tsx watch src/server.ts" 
```
- ## zod

Biblioteca responsavel para fazer a validação, por exemplo validar a variavel id no banco de dados.

```
npm i zod
``` 

- ## dotenv

```
npm i dotenv -D
```
Reponsavel para ler as variaveis de ambiente e converter ela para os process.env


# **Banco de dados**

- ## **Prisma**
    Comando para o prisma usar o banco SQLite em vez do tradicional

    ```bash
    npx prisma init --datasource-provider SQLite
    ```

    Comando para criar a tabela no banco de dados

    ```bash
    npx prisma migrate dev
    ```

    Para vizualizar o banco criado use

    ```bash
    npx prisma studio
    ```

    Para acessar o servidor instale o client

    ```bash
    npm i prisma@client
    ```

    Crie uma pasta lib em src com o arquivo prisma.ts

    ```ts
      import { PrismaClient } from "@prisma/client";

        export const prisma = new PrismaClient({
          log:['query'],
        });
    ```

# **Desenvolvimento do código**

Criado um arquivo server.ts dentro da pasta src

- server.ts

    Criado um servidor Fastify simples que escuta as requisições na porta 3333 
```ts
import fastify from "fastify";

const app = fastify();

app.listen({
    port:3333,
}).then(()=>{
    console.group('Http server running on http://localhost:3333')
})
```
#
Dentro da pasta src foi criado uma pasta chamada lib e o arquivo prisma.ts

- prisma.ts 

    Esse arquivo cria uma instância do prismaClient, para poder acessar os metodos de leitura, consultas etc.

Instale o plugin Cors

```bash
npm i @fastify/cors
```
Este plugin serve como uma técnica de segurança, para determinar quais urls terão acesso ao backend, principalmente em produção.

```ts
app.register(cors, {
    origin: true,
})
```

instale o axios

```bash
npm i axios
```
para fazer requisições http

# **Rotas da aplicação**

Criado uma pasta Routes para fazer o CRUD da aplicação, dentro é colocado todas as rotas da aplicação.

Agora é possivel criar rotas na pasta routes. É criado um arquivo chamado memories.ts responsavel pelas rotas da do banco voltados a parte de memories do projeto.

Quando criado a rota é usado o metodo register do fastify no arquivo server.ts, que registra um arquivo de rotas separado.

#

Rota com identificador

```ts
app.get('/memories/:id', async (request) => {
     
  })
```
#
Esse identificador vem de dentro do fastify em um objeto request, para acessar esse id é usado o metodo params.

```ts
app.get('/memories/:id', async (request) => {
     const {id} =  request.params
  })
```
#
O typescript nao reconhece esse id por isso e necessario validar esse id, para fazer isso utilize a biblioteca zod.

```ts
app.get('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const {id} = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThro({
      where:{
        id,
      },
    })

    return memory;
})
```

Nesse caso esta sendo passado o request.params para o paramsSchema para o zod fazer uma validação se o objeto passado segue a estrutura do dado, essa estrutura seria o schema defindo na constante paramsSchema.
#

### **Rotas**

- ## app.get('/memories' 

    Rota lista todas as memorias em order ascendente.

- ## app.get('/memories/:id' 

    Rota lista uma memoria especificada pelo id usando o metodo findUniqueOrthrow.
- ## app.post('/memories'

    Rota cria uma nova memoria no banco

- ## app.put('/memories/:id'

    Rota para atualizar a memoria no banco

- ## app.delete('/memories/:id

    Rota para deletar uma memoria do banco

# **Authenticação**

Criar as variaveis de ambiente, nesse projeto é usado a authenticação com github, é preciso criar um Client ID e um Client Secrets, para criar acesse o github Developers Settings e entre em OAuth Apps.

É criado o arquivo auth.ts na pasta routes, dentro dele é exportado uma função assyncrona que recebe como parametro o app, que é do tipo fastify instance.

Para fazer a authenticação é feito uma chamada post 

```
app.post('/register
```

Usa-se o zod para fazer a validação de que no corpo da requisição venha o codigo do github. Em seguida uma chamada https usando axios 

```ts
const accessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params:{
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers:{
          Accept: 'application/json',
        },
      }
    )
```

Como paramatros é passado o params contentado as variaveis de ambiente 

#

Agora com o acesstoken é possivel fazer uma requisição ao github para obter os dados do usuário

```ts
const userResponse = await axios.get('https://api.github.com/user',{
    headers:{
      Authorization: `Bearer ${access_token}`, 
    }
    })
```

Em seguida é validado com zod

#

## **JWT**
 
É token criado pelo backend enviado para o frontend, para o front utilizar esse token nas requisições ao backend para verificar os usuarios cadastrados.

instale

```bash
npm i @fastify/jwt
```

import no server.ts e configure

```ts
app.register(jwt, {
    secret: 'spacetime',
})
```
Esse secret é uma chave secreta que diferencia os tokens gerados por esse backend dos outros backends, em produção é aconcelhavel colocar uma string não tão simples, algo como "dafrgjnsgojAEPFNM2ÇO3RNUE8J2ONFOAF0232#@#@#qrq#$!%!"

#

No arquivo auth.ts é adcionado a seguinte linha de codigo

```ts
const token = app.jwt.sign(
      {
        name: user.name,
        avatar_url: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: '30 days',
      },
    )
```

Para gerar o token é preciso passar dois objetos, o primeiro é as informações publicas como nome, avatar.

No segundo objeto é preciso colocar um identificador unico como id e a expiração.

Agora é possivel usar função request.jwtVerify(), esta função verifica se na requisição do frontend esta contido o token.

#

Para usar o jwtVerify em todas as rotas é possivel usar um hook nas rotas para que nao precise chamar a função em cada rota

```ts
app.addHook('preHandler', async (request)=>{
    await request.jwtVerify()
  })
```

Antes de executar o handler de cada rota, é verificado se o usuario esta authenticado

#

Quando usa JWT com typescript é necessário criar um arquivo na pasta src chamado auth.d.ts e dentro dele colocar os tipos contidos no token

```ts
import '@fastify/jwt'

declare module '@fastify/jwt'{
  export interface FastifyJWT {
    user: {
      sub: string,
      name: string,
      avatar_url: string,
    }
  }
}
```

Agora é possivel usar o por exemplo request.user.sub, de uma olhada nas rotas de memories.

#

