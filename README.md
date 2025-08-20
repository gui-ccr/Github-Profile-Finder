<div align="center">

# 🚀 Estudo de Caso: JavaScript Assíncrono e Consumo de API REST

**Uma aplicação web construída com HTML, CSS e JavaScript puro para demonstrar o domínio de conceitos fundamentais do front-end, como manipulação do DOM, programação assíncrona (`async/await`) e consumo de APIs externas.**

<br>

<img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
<img src="https://img.shields.io/badge/API-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub API">

<br>
<br>

<a href="https://gui-ccr.github.io/Github-Profile-Finder/">
  <img src="https://github.com/gui-ccr/github-profile-finder/blob/main/image.png?raw=true" alt="Demonstração do GitHub Profile Finder" width="80%">
</a>

<h3><a href="https://gui-ccr.github.io/Github-Profile-Finder/">🔗 Acessar a Demonstração Ao Vivo 🔗</a></h3>

</div>

---

> 💡 **Nota do Desenvolvedor:** Antes de mergulhar em frameworks, acredito ser essencial dominar os fundamentos. Este projeto foi minha forma de solidificar o conhecimento em JavaScript puro, focando no desafio de lidar com a assincronicidade da web. Construí um consumidor de API REST do zero para praticar o fluxo completo: fazer a requisição, aguardar a resposta, tratar os dados e atualizar a interface dinamicamente, tudo isso de forma otimizada e com um código limpo.

<br>

## 📜 Índice
* [✨ Funcionalidades](#-funcionalidades)
* [🏆 Vitrine Técnica: Conceitos de JavaScript Aplicados](#-vitrine-técnica-conceitos-de-javascript-aplicados)
* [🚀 Como Executar Localmente](#-como-executar-localmente)

---

## ✨ Funcionalidades

| Funcionalidade | Descrição | Status |
| :--- | :--- | :---: |
| 🔍 **Busca de Perfis** | Pesquisa dinâmica de qualquer usuário do GitHub, disparando a busca pela API. | ✅ |
| 👤 **Card de Perfil Detalhado** | Exibe avatar, bio e estatísticas do usuário (`seguidores`, `seguindo`, `repositórios`). | ✅ |
| ⭐ **Lista de Repositórios** | Lista os repositórios do usuário com paginação, para uma navegação eficiente. | ✅ |
| 🚫 **Tratamento de Erros** | Exibe uma mensagem amigável caso o usuário não seja encontrado. | ✅ |
| 🎨 **Tema Claro/Escuro** | Permite ao usuário alternar entre os temas, com a preferência salva no `localStorage`. | ✅ |

---

## 🏆 Vitrine Técnica: Conceitos de JavaScript Aplicados

Este projeto é uma demonstração prática de conceitos essenciais do desenvolvimento web moderno, como pode ser visto nos trechos de código do `script.js`.

<details>
<summary><strong>Consumo de API com `fetch` e Otimização com `Promise.all()`</strong></summary>
<br>
A função `buscarDadosDoGitHub` utiliza `async/await` para uma sintaxe limpa ao lidar com a assincronicidade. Para otimizar o carregamento inicial, as requisições para os dados do perfil e para a primeira página de repositórios são feitas em paralelo usando `Promise.all()`. O bloco `try...catch` garante um tratamento de erros robusto.

```javascript
// Em: script.js
async function buscarDadosDoGitHub() {
    resultadoDiv.innerHTML = '';
    spinner.classList.remove('hidden');

    try {
        const [respostaDoPerfil, respostaDosRepos] = await Promise.all([
            fetch(`https://api.github.com/users/${currentUsername}`),
            fetch(`https://api.github.com/users/${currentUsername}/repos?page=${currentPage}&per_page=10`)
        ]);

        if (!respostaDoPerfil.ok) throw new Error('Usuário não encontrado!');
        
        const dadosDoPerfil = await respostaDoPerfil.json();
        const dadosDosRepos = await respostaDosRepos.json();
        
        spinner.classList.add('hidden');
        renderizarTudo(dadosDoPerfil, dadosDosRepos);
    } catch (erro) {
        spinner.classList.add('hidden');
        renderizarErro(erro.message);
    }
}
```
</details>

<details>
<summary><strong>Manipulação do DOM com `map` e Template Literals</strong></summary>
<br>
A função `criarListaDeReposHTML` demonstra uma forma moderna e eficiente de gerar HTML dinamicamente. Ela usa o método `.map()` para transformar o array de objetos de repositórios em um array de strings HTML e, em seguida, `.join('')` para concatenar tudo em um único bloco de texto, que é injetado no DOM.

```javascript
// Em: script.js
function criarListaDeReposHTML(repos) {
    return repos.map(repo => `
        <li>
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <span>⭐ ${repo.stargazers_count}</span>
        </li>
    `).join('');
}
```
</details>

<details>
<summary><strong>Gerenciamento de Estado e Eventos</strong></summary>
<br>
O estado da aplicação (usuário atual, página atual) é gerenciado por variáveis globais. O `addEventListener` é usado para escutar o `submit` do formulário e os cliques nos botões de paginação, disparando as funções assíncronas correspondentes para buscar e renderizar os novos dados.

```javascript
// Em: script.js
let currentPage = 1;
let currentUsername = '';

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = input.value.trim();
    if (username === '') return;

    currentUsername = username;
    currentPage = 1;
    buscarDadosDoGitHub();
});

resultadoDiv.addEventListener('click', (event) => {
    if (event.target.id === 'next-button') {
        currentPage++;
        buscarRepositorios();
    } // ... Lógica para o botão "anterior"
});
```
</details>

---

## 🚀 Como Executar Localmente

Como este projeto é construído com tecnologias web puras, não há necessidade de um processo de build.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/gui-ccr/github-profile-finder.git](https://github.com/gui-ccr/github-profile-finder.git)
    ```
2.  **Abra o arquivo:**
    * Navegue até a pasta `github-profile-finder`.
    * Abra o arquivo `index.html` diretamente no seu navegador de preferência.

E está pronto para usar!
