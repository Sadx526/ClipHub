/* configuração do supabase */


const SUPABASE_URL = "https://bwdqwbmmcweaabsssqaz.supabase.co";
const SUPABASE_KEY = "sb_publishable_pkc2EZgjuXJdV-JkYm3TrA_a7AvWN3i";


const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


/* elementos */


const authSection = document.getElementById("auth-section");
const forumSection = document.getElementById("forum-section");


const tabLogin = document.getElementById("tab-login");
const tabCadastro = document.getElementById("tab-cadastro");
const formLogin = document.getElementById("form-login");
const formCadastro = document.getElementById("form-cadastro");


const loginErro = document.getElementById("login-erro");
const cadastroErro = document.getElementById("cadastro-erro");
const cadastroSucesso = document.getElementById("cadastro-sucesso");


const usuarioLogado = document.getElementById("usuario-logado");
const btnLogout = document.getElementById("btn-logout");


const btnAdminToggle = document.getElementById("btn-admin-toggle");
const formAdmin = document.getElementById("form-admin");
const adminSenha = document.getElementById("admin-senha");
const adminErro = document.getElementById("admin-erro");


let isAdmin = false;


const formPost = document.getElementById("form-post");
const postTexto = document.getElementById("post-texto");
const postErro = document.getElementById("post-erro");
const listaPosts = document.getElementById("lista-posts");


/* alternar abas login/cadastro */


tabLogin.addEventListener("click", () => {
    tabLogin.classList.add("active");
    tabCadastro.classList.remove("active");
    formLogin.hidden = false;
    formCadastro.hidden = true;
});


tabCadastro.addEventListener("click", () => {
    tabCadastro.classList.add("active");
    tabLogin.classList.remove("active");
    formCadastro.hidden = false;
    formLogin.hidden = true;
});


/* cadastro */


formCadastro.addEventListener("submit", async (event) => {
    event.preventDefault();


    cadastroErro.textContent = "";
    cadastroSucesso.textContent = "";


    const email = document.getElementById("cadastro-email").value.trim();
    const senha = document.getElementById("cadastro-senha").value;


    const { error } = await supabaseClient.auth.signUp({ email, password: senha });


    if(error){
        cadastroErro.textContent = traduzErro(error.message);
        return;
    }


    cadastroSucesso.textContent = "Conta criada! Verifique seu e-mail para confirmar (se a confirmação estiver ativada) e depois faça login.";
    formCadastro.reset();
});


/* login */


formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();


    loginErro.textContent = "";


    const email = document.getElementById("login-email").value.trim();
    const senha = document.getElementById("login-senha").value;


    const { error } = await supabaseClient.auth.signInWithPassword({ email, password: senha });


    if(error){
        loginErro.textContent = traduzErro(error.message);
    }
});


/* logout */


btnLogout.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
});


/* admin */


btnAdminToggle.addEventListener("click", () => {
    formAdmin.hidden = !formAdmin.hidden;
    if(!formAdmin.hidden){
        adminSenha.focus();
    }
});


formAdmin.addEventListener("submit", async (event) => {
    event.preventDefault();


    adminErro.textContent = "";


    const { data, error } = await supabaseClient.rpc("tornar_admin", { senha: adminSenha.value });


    if(error || !data){
        adminErro.textContent = "Senha incorreta.";
        return;
    }


    isAdmin = true;
    formAdmin.hidden = true;
    btnAdminToggle.hidden = true;
    adminSenha.value = "";


    carregarPosts();
});


async function verificarAdmin(userId){
    const { data } = await supabaseClient
        .from("admins")
        .select("user_id")
        .eq("user_id", userId);


    return Boolean(data && data.length > 0);
}


/* estado de autenticação */


supabaseClient.auth.onAuthStateChange((_event, session) => {
    atualizarTela(session);
});


async function iniciar(){
    const { data } = await supabaseClient.auth.getSession();
    atualizarTela(data.session);
}


async function atualizarTela(session){
    if(session){
        authSection.hidden = true;
        forumSection.hidden = false;


        usuarioLogado.textContent = "Logado como " + session.user.email;


        isAdmin = await verificarAdmin(session.user.id);
        btnAdminToggle.hidden = isAdmin;


        carregarPosts();
    } else {
        authSection.hidden = false;
        forumSection.hidden = true;
    }
}


/* criar post ou resposta */


async function publicar(texto, parentId){
    const { data } = await supabaseClient.auth.getSession();
    const session = data.session;


    if(!session){
        return { error: { message: "Você precisa estar logado." } };
    }


    if(texto === ""){
        return { error: null };
    }


    const linha = {
        user_id: session.user.id,
        author_email: session.user.email,
        content: texto
    };


    if(parentId){
        linha.parent_id = parentId;
    }


    return await supabaseClient.from("posts").insert([linha]);
}


formPost.addEventListener("submit", async (event) => {
    event.preventDefault();


    postErro.textContent = "";


    const texto = postTexto.value.trim();
    const { error } = await publicar(texto, null);


    if(error){
        postErro.textContent = "Não foi possível publicar: " + error.message;
        return;
    }


    postTexto.value = "";
    carregarPosts();
});


/* carregar e renderizar posts */


async function carregarPosts(){
    listaPosts.innerHTML = '<p class="carregando">Carregando posts...</p>';


    const { data, error } = await supabaseClient
        .from("posts")
        .select("*")
        .order("created_at", { ascending: true });


    if(error){
        listaPosts.innerHTML = '<p class="sem-posts">Erro ao carregar posts.</p>';
        return;
    }


    if(!data || data.length === 0){
        listaPosts.innerHTML = '<p class="sem-posts">Nenhum post ainda. Seja o primeiro a escrever!</p>';
        return;
    }


    const principais = data
        .filter((p) => !p.parent_id)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));


    listaPosts.innerHTML = "";


    principais.forEach((post) => {
        const respostas = data
            .filter((p) => p.parent_id === post.id)
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));


        listaPosts.appendChild(criarPostEl(post, respostas));
    });
}


function criarPostEl(post, respostas){
    const div = document.createElement("div");
    div.classList.add("post");


    div.appendChild(criarConteudoPost(post));


    if(isAdmin){
        div.appendChild(criarBtnExcluir(post.id));
    }


    const btnResponder = document.createElement("button");
    btnResponder.classList.add("btn-responder");
    btnResponder.textContent = "Responder";


    const formResposta = document.createElement("form");
    formResposta.classList.add("form-resposta");
    formResposta.hidden = true;


    const textareaResposta = document.createElement("textarea");
    textareaResposta.placeholder = "Escreva sua resposta...";
    textareaResposta.maxLength = 500;
    textareaResposta.required = true;


    const btnEnviarResposta = document.createElement("button");
    btnEnviarResposta.type = "submit";
    btnEnviarResposta.classList.add("btn-auth");
    btnEnviarResposta.textContent = "Enviar";


    const erroResposta = document.createElement("p");
    erroResposta.classList.add("auth-erro");


    formResposta.appendChild(textareaResposta);
    formResposta.appendChild(btnEnviarResposta);
    formResposta.appendChild(erroResposta);


    btnResponder.addEventListener("click", () => {
        formResposta.hidden = !formResposta.hidden;
        if(!formResposta.hidden){
            textareaResposta.focus();
        }
    });


    formResposta.addEventListener("submit", async (event) => {
        event.preventDefault();


        erroResposta.textContent = "";


        const texto = textareaResposta.value.trim();
        const { error } = await publicar(texto, post.id);


        if(error){
            erroResposta.textContent = "Não foi possível responder: " + error.message;
            return;
        }


        carregarPosts();
    });


    div.appendChild(btnResponder);
    div.appendChild(formResposta);


    if(respostas.length > 0){
        const containerRespostas = document.createElement("div");
        containerRespostas.classList.add("respostas");


        respostas.forEach((resposta) => {
            const respostaDiv = document.createElement("div");
            respostaDiv.classList.add("post", "post-resposta");
            respostaDiv.appendChild(criarConteudoPost(resposta));


            if(isAdmin){
                respostaDiv.appendChild(criarBtnExcluir(resposta.id));
            }


            containerRespostas.appendChild(respostaDiv);
        });


        div.appendChild(containerRespostas);
    }


    return div;
}


function criarBtnExcluir(postId){
    const btn = document.createElement("button");
    btn.classList.add("btn-excluir");
    btn.textContent = "Excluir";


    btn.addEventListener("click", async () => {
        const confirmou = confirm("Excluir esse post? Isso não pode ser desfeito.");
        if(!confirmou){
            return;
        }


        await supabaseClient.from("posts").delete().eq("id", postId);
        carregarPosts();
    });


    return btn;
}


function criarConteudoPost(post){
    const fragmento = document.createDocumentFragment();


    const autor = document.createElement("p");
    autor.classList.add("post-autor");
    autor.textContent = post.author_email;


    const texto = document.createElement("p");
    texto.classList.add("post-texto");
    texto.textContent = post.content;


    const data = document.createElement("p");
    data.classList.add("post-data");
    data.textContent = new Date(post.created_at).toLocaleString("pt-BR");


    fragmento.appendChild(autor);
    fragmento.appendChild(texto);
    fragmento.appendChild(data);


    return fragmento;
}


/* traduzir erros comuns */


function traduzErro(mensagem){
    if(mensagem.includes("Invalid login credentials")){
        return "E-mail ou senha incorretos.";
    }
    if(mensagem.includes("already registered")){
        return "Esse e-mail já tem uma conta.";
    }
    if(mensagem.includes("Password should be at least")){
        return "A senha precisa ter pelo menos 6 caracteres.";
    }
    if(mensagem.includes("Email not confirmed")){
        return "Confirme seu e-mail antes de entrar (verifique sua caixa de entrada).";
    }
    return mensagem;
}


iniciar();



