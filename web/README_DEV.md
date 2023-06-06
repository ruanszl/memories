#
Comando para criar um novo projeto com next

```bash
npx creat-next-app-latest web --use-npm
```

Instalar a configuração do eslint da rocketseat 

```bash
npm i @rocketseat/eslint-config -D
```

Adcione essa linha ao arquivo .eslintrc.json

```bash
" @rocketseat/eslint-config/react"
```

#

# App

## Page

Page principal da aplicação, essa pagina mostra apenas o lado direito, visto que o lado esquerdo não muda na aplicação e esta em layout, aqui é apenas chamado o componente <a href="#EmptyMemories">EmptyMemories</a>

## Layout

Layout é responsavel por renderizar em todos os filhos, ou seja vamos supor que eu crie outro pasta em app e adicione uma page, essa page vai herdar esse layout.

Layout carrega as fontes do google.

Os stripers são os traços que tem ao meio da aplicação

Contem o blur que faz parte da estilização do background da tela, ele forma um tipo de luz redonda da cor roxa

Const isAuthenticate verifica se existe um cookie chamado token

Caso exista ele usa o componente <a href="#Profile">Profile</a>, caso contrario <a href="#SignIn">SignIn</a>

A esquerda ficara o children.

# App/memories/new

## Page

Eu tenho um link para voltar a home e um componente <a href="NewMemoryForm"> NewMemoryForm<a/> responsael por criar novas memórias.

# Componentes

## EmptyMemories

Componente que mostra o lado direito da aplicação quando o usuário não criou nenhuma memória.

## Hero

Componente que manda o usuário para a página de criação de lembrança

## MidiaPicker

Componente responsavel por fazer o input de uma nova imagem.

Input do tipo onchange, ele recebe uma função onFileSelected, ela recebe como argumento um evento do tipo changeEvent, dica " Para descobrir qual tipo do evento basta ir na tag input e clicar seguraando o ctrl em onChange ele vai mostrar o tipo esperado" ChangeEvent e entre <> é colocado o tipo de elemento html, nesse caso o tipo HTMLInputElement.

Esse componente mostra uma previa da imagem para o usuário, para isso é usado o useState, veja que ele é do tipo string ou null, para caso não tenha selecionado nenhum arquivo.

É criado uma constante que recebe a propriedade files, essa propriedade é extraida do objeto event.target.

Caso não exista files a função retorna, se caso exista é criado uma constante previewUrl, essa constante recebe o metodo URL.createObjectURL() que cria uma url unica para o objeto especificado e atribui a setPreview essa url.

Agora basta fazer um tratamento condicional no input para quando preview existir ele mostrar a tag img contendo a imagem preview.

Como o input é não bonito, use um hackzin, faça um input com um id e use esse id no campo htmlFor de um label, assim é possivel estilizar a label em vez do input. Esse input esta sendo usado em um label em <a href="NewMemoryForm">NewMemoryForm</a>.

Foi colocado uma estilização no input para ele ficar invizivel e sem tamanho.

## NewMemoryForm

Componente responsavel pelo formulário.

Ele renderiza um formulario do tipo onSubmit que recebe uma função handleCreateMemory.

O formulario usa a tag label para fazer a estilização do Anexar midia em vez de fazer no input, foi criado um componente especifico para esse input <a href="MidiaPicker">MidiaPicker</a>.

O proximo input se refere a caixa de seleção para definir o estado da memoria.
Para usar o input com estilização melhor, use o plugin forms do tailwind

```
npm i @tailwindcss/forms
```

É Necessário colocar esta linha "require('@tailwindcss/forms')" sem aspas, no arquivo tailwind.config.js, em plugins.

O bottão do tipo submit quando acionado, chama a função handleCreateMemory. Função assyncrona que recebe o event do tipo FormEvent. PreventDefault não deixa o formulario ser enviado ao servidor sem as devidas verificações.

A constante formData recebe um new FormData, para registrar todos os dados do form, por isso é passado para ele event.currentTarget.

A constante fileTUpload recebe o arquivo coverUrl que foi pego com o input de <a href="NewMemoryForm">NewMemoryForm</a>

Caso fileTUpload exista é criado uma nova constante uploaFormData que recebe um new FormData() pq na rota de upload no backend não suporta json, suporta apenas multipart/form-data. Agora atribuimo a variavel o campo file de fileTupload, esse campo corresponde ao arquivo recebido no input <a href="NewMemoryForm">NewMemoryForm</a>. Com isso fazemos um requisição post para a rota upload passando o arquivo contido na variavel uploadFormData.

O retorno dessa rota é o caminho aonde esta guardado no backend o arquivo.

Agora é possível mandar a memória para o backend, para isso é criado uma requisição post para a rota /memories, agora se pode mandar em formato json.

Para mandar é necessário a authorização do usuário, para enviar essa authorização é necessário do token que está dentros dos cookies, entretando para usar os cookies dentro de componentes que usam o 'use client'.

Para usar os cookies nessa aplicação, instale a biblioteca js-cookie

```bash
npm i js-cookie
```

e para usar com typescript instale

```bash
npm i --save-dev @types/js-cookie
```

Agora é possivel crar uma constante token que recebe de dentro de cookie.get o token.

Para mandar o token, basta enviar atravez do headers no campo Authorization seguindo esse modelo

```ts
Authorization: `Bearer ${token}`,
```

Aonde token é nome do token definido da criação do mesmo.

Por fim quando o formulario é enviado usamos router do next/navigation para voltar para home.

## SignIn

Componente de login, nele tem uma ancora com um href que leva o usuário para o login com github como mensionado na sessão de <a href="#Authenticação">Authenticação</a>

## Profile

Profile é um compoente que renderiza quando o usuario ja esta logado, ele gera a imagem do usuario e algumas informações. Ele substitui o SignIn.

Ele também tem a função de deslogar (sair)

Para usar o Image do Next é necessário ir no arquivo next.config.js e adicionar o dominio que contem os avatares nesse caso o do github.

# Authenticação

## Variaveis de ambiente

O next tem uma peculiaridade, para adicionar variaveis de ambiente que serão utilizadas em em seu app, é necessário colocar 

```conf
NEXT_PUBLIC_"restante da variavel"=
```

#

Para fazer a authenticação com github, é preciso adicionar esse caminho no campo href do componente signIn

```ts
<a 
  href={`https://github.com/oauth/authorize?client_id=${process.env.NEXT_PIBLIC_GITHUB_CLIENT_ID}`}
>
```
Esse caminho levará o usuário a fazer a authenticação na pagina do github.
#

Agora crie uma pasta lib e crie o arquivo api.ts
Para isso instale axios

```bash
npm i axios
```

Esse arquivo cria a rota padrão para se comunicar com o backend, para quando for fazer requisições, não precisar passar o caminho inteiro

#

Agora note que para pegar o token vindo do github, é preciso verificar o caminho la no site do github no qual foi colado para fazer o callback, nesse caso o caminho colocado la é api/auth/callback, então é necessário que na pasta app crie-se o mesmo caminho, crie as pastas api , dentro dela auth e dentro de auth callback, por fim crie o arquivo route.ts na pasta callback

Em route exporte uma função assincrona GET, pois para acessar uma url diretamente sempre é GET, essa função recebe como parametro o request do tipo NextRequest, que é o tipo para lidar com as solicitações http.

Agora é possivel buscar o searchParams usando uma new URL da request.url, isso vai buscar todos os paramtros que estão vindo com a request.

Em seguida pode ser pego o code, fazendo um get em searchparams para buscar apenas o code.

Em seguida é possivel fazer uma chamada para o servidor, usando o metodo post para gerar o token, basta enviar o code para o caminho.

Agora basta redirecionar o usuario para a pagina e criar o cookie para salvar o token.

Crie também uma pasta logout na pasta auth e crie o arquivo route.ts, esse arquivo vai servir para deslogar , ele coloca o tempo de expiraçao do cookie em 0 para que o cookie expire e o cliente deslogue da aplicação.

Existe algumas explicações para o funcionamente desse arquivo na sessão <a href="#Middleware">Middleware</a>

#

Instale jwt-decode

```bash
npm i jwt-decode
```

Decode sera responsavel por pegar as informoções do token como nome, avatar.

Para isso crie um arquivo na pasta lib e use o jwt-decode para extrair essas informações.

#

## Middleware

Crie este arquivo em src, este arquivo é responsavel por interceptar o acesso do usuário a algum lugar, para funcionar é preciso exportar um const config com a propriedade matcher, essa propriedade vai receber os caminhos que devem ser interceptados, nesse caso o caminho /memories/:path* ou seja, todo caminho que contem memories e algo depois, vai ser interceptado.

O fluxo dessa aplicação consciste em verificar se o token existe, caso exista ele apenas da um return em next, ele apenas deixa a aplicaçãos seguir, caso nao tenha um cookie, ele vai redirecionar o usuário ao mesmo link de login com github usado no componente signIn.

Ele cria um cookie e salva e salva o caminho que o usuário esta com duração de 20 segundos, usuário será redirecionado para o login, quando ele for fazer o login com o github há uma cofigurações la no git em que o desenvolvedor informa o caminho de retorno, um callback, que redireciona o usuário para um determinado lugar, quando fazer esse login esse redirecionamento traz o usuário para o arquivo route.ts em callback, dentro desse arquivo é criado uma constante redirectTO que recebe o cookie de onde o usuário estava tentando acesso antes de logar, por exemplo, vamos supor que o usuario abra o navegador e entre diretamente no caminho de criação de memoria e ele não esta logado na aplicação, o cookie redirectTO vai salvar esse caminho para quando chegar nesse arquivo route ele verificar se o usuário esta logado, caso esteja ele redirecionara o usuário para o caminho salvo no cookie redirectTO.

No arquivo route, basta criar uma constante redirecto e buscar o cookie redirectTo, caso o usuário não esteja logado envia ele para home "/", caso ele esteja logado, envia ele para a url vinda do cookie redirectTo. 

