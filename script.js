// --- NOVO CÓDIGO PARA O TEMA ---

// 1. Eu pego as ferramentas que preciso: o botão de tema e o elemento <body>.
const themeToggleButton = document.querySelector('#theme-toggle-button');
const body = document.querySelector('body');

function atualizarIconeDoTema(){
    const temaAtual = body.dataset.theme

    if (temaAtual == 'light'){
        themeToggleButton.innerHTML = '⏾'
    }else{
        themeToggleButton.innerHTML = '☀'
    }
}

// 2. Eu crio o "escutador" para o clique no botão de tema.
themeToggleButton.addEventListener('click', () => {
    // Eu pego o tema atual lendo o atributo 'data-theme' do body.
    // Se for 'light', o novo tema será 'dark'. Caso contrário, será 'light'.
    const isLight = body.dataset.theme === 'light';
    const novoTema = isLight ? 'dark' : 'light';
    
    // Eu defino o novo tema no atributo 'data-theme' do body.
    // Isso vai fazer com que as variáveis de cor do CSS mudem automaticamente!
    body.dataset.theme = novoTema;

    // Eu salvo a escolha do usuário no localStorage para lembrar da próxima vez.
    localStorage.setItem('tema', novoTema);
    atualizarIconeDoTema()
});

// 3. Eu verifico se o usuário já tinha um tema salvo.
// Isso acontece uma vez, quando a página carrega.
const temaSalvo = localStorage.getItem('tema');

if (temaSalvo) {
    // Se encontrei um tema salvo, eu o aplico imediatamente no body.
    body.dataset.theme = temaSalvo;
}

// --- FIM DO CÓDIGO DO TEMA ---


const form = document.querySelector('#form-busca');
const input = document.querySelector('#input-busca');
const resultadoDiv = document.querySelector('#resultado');
const spinner = document.querySelector('#spinner')


// --- EVENTO PRINCIPAL ---
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = input.value.trim();

    if (username === '') return;

    // Agora, a função de busca vai lidar com tudo, inclusive o loading.
    buscarDadosDoGitHub(username);
});

// --- FUNÇÕES ---

async function buscarDadosDoGitHub(username) {
    // Agora, em vez de texto, eu limpo a área de resultado...
    resultadoDiv.innerHTML = '';
    // ...e mostro meu spinner removendo a classe 'hidden'.
    spinner.classList.remove('hidden');

    try {
        // CONCEITO NOVO: Promise.all()
        // Eu faço os dois "pedidos" ao mesmo tempo, sem 'await' ainda.
        // Isso me dá duas "promessas" (os pagers do restaurante).
        const promessaDoPerfil = fetch(`https://api.github.com/users/${username}`);
        const promessaDosRepos = fetch(`https://api.github.com/users/${username}/repos`);

        // Eu entrego meus dois "pagers" para o Promise.all.
        // Ele vai esperar que AMBOS os pedidos fiquem prontos.
        // O 'await' agora espera pelo grupo todo.
        const [respostaDoPerfil, respostaDosRepos] = await Promise.all([
            promessaDoPerfil,
            promessaDosRepos,
        ]);
        
        // Eu verifico se AMBAS as respostas foram bem-sucedidas.
        if (!respostaDoPerfil.ok || !respostaDosRepos.ok) {
            throw new Error('Erro ao buscar os dados. Verifique o nome do usuário.');
        }

        // Eu pego o JSON de ambas as respostas, também de forma paralela.
        const [dadosDoPerfil, dadosDosRepos] = await Promise.all([
            respostaDoPerfil.json(),
            respostaDosRepos.json(),
        ]);

        // Com os dados prontos, eu escondo o spinner...
        spinner.classList.add('hidden');
        // ...e então renderizo os resultados.
        renderizarTudo(dadosDoPerfil, dadosDosRepos);

    } catch (erro) {
        // Se der erro, eu também escondo o spinner...
        spinner.classList.add('hidden');
        // ...e então mostro a mensagem de erro.
        renderizarErro(erro.message);
    }
}

// Esta função agora renderiza tanto o perfil quanto os repositórios.
function renderizarTudo(perfil, repos) {
    // Eu monto o HTML do perfil primeiro.
    let htmlDoPerfil = `
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
    // Eu chamo a função que gera o HTML dos repositórios e o insiro no final do card.

    resultadoDiv.innerHTML = htmlDoPerfil;
}

/*
 * Minha função que funciona como uma "linha de produção" de HTML para os repositórios.
 * O objetivo dela é receber um array gigante de objetos (os repositórios) e, no final,
 * me devolver um único bloco de texto HTML com uma lista dos 10 mais populares.
 */
function renderizarRepositorios(repos) {
    
    // --- ETAPA 1: PREPARAÇÃO E FILTRAGEM DOS DADOS ---
    // Nesta etapa, eu pego a lista bruta da API e a deixo do jeito que eu quero.
    const repositoriosOrdenados = repos
        
        // 1. O Organizador (.sort)
        // Eu atuo como um bibliotecário para organizar o array. A regra que eu passo
        // para o sort, '(a, b) => b.stargazers_count - a.stargazers_count', compara
        // dois repositórios de cada vez e coloca o que tem mais estrelas ('b') na frente
        // daquele que tem menos ('a'). O resultado é o array inteiro ordenado do mais popular para o menos popular.
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        
        // 2. O Fatiador (.slice)
        // Depois de organizar a estante inteira, eu uso o .slice(0, 10) para pegar
        // apenas uma "fatia do bolo": os 10 primeiros itens. Isso me dá um novo array,
        // menor, contendo apenas os 10 repositórios mais populares.
        .slice(0, 10);
    
    
    // --- ETAPA 2: TRANSFORMAÇÃO DOS DADOS EM HTML ---
    // Agora que tenho os dados certos, preciso transformá-los em HTML.
    const listaDeReposHTML = repositoriosOrdenados

        // 3. A Fábrica de HTML (.map)
        // Eu passo meus 10 objetos de repositório por uma "fábrica". Para cada
        // objeto de repositório que entra, o .map me devolve uma string de texto
        // formatada como um item de lista `<li>`. No final, eu tenho um NOVO array,
        // mas em vez de objetos, ele contém 10 strings de HTML.
        .map(repo => `
            <li>
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <span>⭐ ${repo.stargazers_count}</span>
            </li>
        `)

        // 4. A Cola (.join)
        // Agora eu tenho um array com 10 pedaços de HTML `<li>`. O .join('') age
        // como uma "cola", juntando todos esses pedaços em uma única e gigante
        // string de texto, sem nada ('') entre eles.
        .join('');

    // --- ETAPA 3: RETORNO DO BLOCO HTML COMPLETO ---
    // Por fim, eu pego essa string gigante de `<li>`s, a coloco dentro da estrutura
    // de uma `div` com um `h3` e uma `ul`, e retorno o bloco de HTML completo,
    // pronto para ser colocado na página.
    return `
        <div class="repos-container">
            <h3>Principais Repositórios</h3>
            <ul>
                ${listaDeReposHTML}
            </ul>
        </div>
    `;
}