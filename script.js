// --- MINHAS FERRAMENTAS E ESTADO GLOBAL ---
const form = document.querySelector('#form-busca');
const input = document.querySelector('#input-busca');
const resultadoDiv = document.querySelector('#resultado');
const spinner = document.querySelector('#spinner');

let currentPage = 1;
let currentUsername = '';
let totalRepos = 0;

// --- CÓDIGO DO TEMA ---
const themeToggleButton = document.querySelector('#theme-toggle-button');
const body = document.querySelector('body');

function atualizarIconeDoTema() {
    const temaAtual = body.dataset.theme;
    if (temaAtual === 'light') {
        themeToggleButton.innerHTML = '🌙';
    } else {
        themeToggleButton.innerHTML = '☀️';
    }
}

themeToggleButton.addEventListener('click', () => {
    const isLight = body.dataset.theme === 'light';
    const novoTema = isLight ? 'dark' : 'light';
    body.dataset.theme = novoTema;
    localStorage.setItem('tema', novoTema);
    atualizarIconeDoTema();
});

const temaSalvo = localStorage.getItem('tema');
if (temaSalvo) {
    body.dataset.theme = temaSalvo;
}
atualizarIconeDoTema();
// --- FIM DO CÓDIGO DO TEMA ---

// --- EVENTOS ---
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
    } else if (event.target.id === 'prev-button') {
        if (currentPage > 1) {
            currentPage--;
            buscarRepositorios(); // CORREÇÃO: Adicionei os parênteses () aqui.
        }
    }
});

// --- FUNÇÕES DE LÓGICA E RENDERIZAÇÃO ---

async function buscarDadosDoGitHub() {
    resultadoDiv.innerHTML = '';
    spinner.classList.remove('hidden');

    try {
        // CORREÇÃO: As buscas aqui agora usam 'currentUsername' e os parâmetros de paginação.
        const [respostaDoPerfil, respostaDosRepos] = await Promise.all([
            fetch(`https://api.github.com/users/${currentUsername}`),
            fetch(`https://api.github.com/users/${currentUsername}/repos?page=${currentPage}&per_page=10`)
        ]);

        if (!respostaDoPerfil.ok) throw new Error('Usuário não encontrado!');
        
        const dadosDoPerfil = await respostaDoPerfil.json();
        totalRepos = dadosDoPerfil.public_repos;

        let dadosDosRepos = [];
        if (respostaDosRepos.ok) {
            dadosDosRepos = await respostaDosRepos.json();
        }
        
        spinner.classList.add('hidden');
        renderizarTudo(dadosDoPerfil, dadosDosRepos);
    } catch (erro) {
        spinner.classList.add('hidden');
        renderizarErro(erro.message);
    }
}

async function buscarRepositorios() {
    const reposContainer = document.querySelector('.repos-container ul');
    if (reposContainer) reposContainer.innerHTML = '<li>Carregando mais repositórios...</li>';

    try {
        const resposta = await fetch(`https://api.github.com/users/${currentUsername}/repos?page=${currentPage}&per_page=10`);
        if (!resposta.ok) throw new Error('Não foi possível carregar mais repositórios.');
        
        const dadosDosRepos = await resposta.json();
        renderizarApenasRepos(dadosDosRepos);
    } catch (erro) {
        renderizarErro(erro.message);
    }
}

function renderizarTudo(perfil, repos) {
    const htmlDoPerfil = `
        <div class="profile-card">
            <a href="${perfil.html_url}" target="_blank">
                <img src="${perfil.avatar_url}" alt="Foto de perfil de ${perfil.name}" class="avatar">
            </a>
            <h2>${perfil.name || perfil.login}</h2>
            <p class="username">@${perfil.login}</p>
            <p class="bio">${perfil.bio || 'Este usuário não possui uma bio.'}</p>
            <div class="stats">
                <div><strong>Repositórios</strong><span>${perfil.public_repos}</span></div>
                <div><strong>Seguidores</strong><span>${perfil.followers}</span></div>
                <div><strong>Seguindo</strong><span>${perfil.following}</span></div>
            </div>
            ${renderizarRepositorios(repos)} 
        </div>
    `;
    resultadoDiv.innerHTML = htmlDoPerfil;
    atualizarBotoesPaginacao(repos);
}

function renderizarApenasRepos(repos) {
    const reposContainer = document.querySelector('.repos-container ul');
    const pageNumberSpan = document.querySelector('#page-number');
    if (reposContainer) reposContainer.innerHTML = criarListaDeReposHTML(repos);
    if (pageNumberSpan) pageNumberSpan.textContent = `Página ${currentPage}`;
    atualizarBotoesPaginacao(repos);
}

function criarListaDeReposHTML(repos) {
    return repos.map(repo => `
        <li>
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <span>⭐ ${repo.stargazers_count}</span>
        </li>
    `).join('');
}

// CORREÇÃO: Removi a função duplicada e deixei apenas esta, que é a correta.
function renderizarRepositorios(repos) {
    if (totalRepos > 0 && repos.length === 0) {
        return '<p>Não há mais repositórios para exibir.</p>';
    }
    if (totalRepos === 0) {
        return '<p>Nenhum repositório público encontrado.</p>';
    }

    const listaDeReposHTML = criarListaDeReposHTML(repos);
    return `
        <div class="repos-container">
            <h3>Principais Repositórios</h3>
            <div class="pagination-controls">
                <button id="prev-button">Anterior</button>
                <span id="page-number">Página ${currentPage}</span>
                <button id="next-button">Próxima</button>
            </div>
            <ul>
                ${listaDeReposHTML}
            </ul>
        </div>
    `;
}

function atualizarBotoesPaginacao(repos) {
    const prevButton = document.querySelector('#prev-button');
    const nextButton = document.querySelector('#next-button');

    if (prevButton) prevButton.disabled = currentPage === 1;
    if (nextButton) nextButton.disabled = repos.length < 10 || currentPage * 10 >= totalRepos;
}

function renderizarErro(mensagem) {
    resultadoDiv.innerHTML = `<p class="erro">${mensagem}</p>`;
}