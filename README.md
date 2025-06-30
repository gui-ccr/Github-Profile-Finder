# 🚀 GitHub Profile Finder

Uma aplicação web simples e elegante que permite buscar perfis de usuário do GitHub e visualizar suas informações detalhadas e repositórios mais populares em tempo real. Este projeto foi construído com HTML, CSS e JavaScript puro, focando no consumo de APIs REST e na manipulação assíncrona de dados.

### 🔗 [Clique aqui para a demonstração ao vivo](https://gui-ccr.github.io/Github-Profile-Finder/)] 


---

### ✨ Funcionalidades

* **Busca de Perfis:** Pesquisa dinâmica de qualquer usuário existente no GitHub.
* **Visualização de Perfil:** Exibe um card completo com avatar, nome, bio, e estatísticas de seguidores e repositórios.
* **Repositórios Populares:** Lista os 10 repositórios mais populares do usuário, ordenados por estrelas.
* **Links Diretos:** Todos os avatares e nomes de repositório são links clicáveis que levam diretamente para o GitHub.
* **Tratamento de Erros:** Exibe uma mensagem amigável caso o usuário não seja encontrado ou ocorra um erro de rede.
* **Interface Limpa:** Um design simples e focado na usabilidade.

### 📸 Screenshot

![Screenshot do Projeto](/image.png)


---

### 💻 Tecnologias Utilizadas

* **HTML5** (Estruturação semântica)
* **CSS3** (Estilização com Flexbox para layout responsivo)
* **JavaScript (ES6+)** (Lógica da aplicação e interatividade)
* **GitHub API** (Fonte dos dados de perfis e repositórios)

---

### 🧠 Conceitos Aplicados e Aprendizados

Este projeto foi uma oportunidade para aprofundar em conceitos essenciais do desenvolvimento web moderno:

* **Consumo de APIs REST:** Utilização do `fetch` para fazer requisições HTTP GET a um serviço externo.
* **Programação Assíncrona:** Uso intensivo de `async/await` para lidar com operações de rede de forma limpa e legível.
* **Tratamento de Múltiplas Requisições:** Uso de `Promise.all()` para buscar dados do perfil e dos repositórios em paralelo, otimizando o tempo de carregamento.
* **Manipulação do DOM:** Criação e inserção de elementos HTML dinamicamente na página com base nos dados recebidos da API.
* **Métodos de Array Avançados:** Aplicação de `.sort()`, `.slice()`, `.map()` e `.join()` para processar, ordenar e transformar os dados dos repositórios antes de exibi-los.
* **Estrutura de Controle de Erros:** Implementação do bloco `try...catch` para gerenciar falhas na requisição e fornecer feedback claro ao usuário.
* **Template Literals:** Geração de blocos de HTML complexos de forma eficiente e legível.

---

### 🔮 Melhorias Futuras

Este projeto pode ser expandido com as seguintes funcionalidades:

- [ ] Adicionar um "spinner" ou animação de carregamento mais elaborada.
- [ ] Paginação para a lista de repositórios.
- [ ] Implementar um tema claro/escuro.
- [ ] Gráficos para visualizar a linguagem mais usada pelo usuário.

---

Feito com dedicação por **Guilherme CCR**.

### ▶️ Como Executar Localmente

```bash
# 1. Clone este repositório
$ git clone [https://github.com/gui-ccr/github-profile-finder.git]

# 2. Navegue até o diretório do projeto
$ cd github-profile-finder

# 3. Abra o arquivo index.html no seu navegador de preferência

