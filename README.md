# ClipHub - Sistema de Login e Cadastro

Um site moderno e responsivo com telas de login e cadastro inspirado no design do Medal.tv.

## 🎨 Características

- ✨ Design moderno com gradientes e animações suaves
- 📱 Completamente responsivo (desktop, tablet, mobile)
- 🎯 Tema escuro profissional
- 🔐 Validação de formulários em tempo real
- 💪 Indicador de força de senha
- 🔄 Transições suaves entre login e cadastro
- 🌐 Suporte a login/cadastro por redes sociais (placeholder)
- 💾 Persistência de dados no localStorage
- ⚡ Sem dependências externas (vanilla JavaScript)

## 📁 Estrutura de Arquivos

```
site/
├── index.html      # Página HTML principal
├── styles.css      # Estilos CSS
├── script.js       # Lógica JavaScript
└── README.md       # Este arquivo
```

## 🚀 Como Usar

### Abrir no Navegador

1. Navegue até a pasta do projeto:
   ```bash
   cd c:\Users\Aluno\Desktop\site
   ```

2. Abra o arquivo `index.html` em um navegador web:
   - Clique duplo no arquivo `index.html`
   - Ou arraste o arquivo para o navegador
   - Ou acesse via um servidor local (recomendado)

### Usar com Servidor Local (Recomendado)

#### Com Python:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Depois acesse: `http://localhost:8000`

#### Com Node.js (http-server):
```bash
npm install -g http-server
http-server .
```

Depois acesse: `http://localhost:8080`

#### Com PHP:
```bash
php -S localhost:8000
```

Depois acesse: `http://localhost:8000`

## 🎮 Funcionalidades

### Tela de Login
- Email com validação em tempo real
- Senha com mínimo 8 caracteres
- Opção "Lembrar-me"
- Links para cadastro e recuperação de senha
- Login com Google ou Discord

### Tela de Cadastro
- Nome e Sobrenome
- Email com validação
- Nome de usuário único (3-20 caracteres)
- Senha com indicador de força
- Confirmação de senha
- Aceitar Termos de Serviço
- Cadastro com Google ou Discord

### Validações
- Email válido
- Senha com mínimo 8 caracteres
- Senhas correspondentes no cadastro
- Evita duplicatas de email e usuário
- Nome de usuário com formato válido

## 📋 Atalhos de Teclado

- `Ctrl + L` - Ir para login
- `Ctrl + S` - Ir para cadastro

## 💾 Armazenamento de Dados

Os dados são armazenados localmente no navegador usando `localStorage`:

- **Usuário logado**: `localStorage.getItem('user')`
- **Usuários cadastrados**: `localStorage.getItem('users')`

Para limpar os dados, abra o console do navegador (F12) e execute:
```javascript
localStorage.clear();
```

## 🎨 Cores Principais

- **Primário**: #7c3aed (Roxo)
- **Secundário**: #1f2937 (Cinza escuro)
- **Fundo**: #111827 (Preto escuro)
- **Texto**: #f3f4f6 (Branco)
- **Sucesso**: #10b981 (Verde)
- **Erro**: #ef4444 (Vermelho)

## 📱 Responsive Design

- Desktop: Layout de duas colunas com features ao lado
- Tablet: Layout adaptado com grid responsivo
- Mobile: Layout single-column otimizado

## 🔧 Customização

### Mudar Cores
Edite as variáveis CSS no início do arquivo `styles.css`:

```css
:root {
    --primary: #7c3aed;
    --secondary: #1f2937;
    --background: #111827;
    /* ... mais cores ... */
}
```

### Mudar Logo
No arquivo `index.html`, modifique o HTML do logo:
```html
<div class="logo">
    <span class="logo-icon">▶</span>
    <span class="logo-text">ClipHub</span>
</div>
```

### Adicionar Seções
Adicione novas seções no `index.html` e estilize-as no `styles.css`.

## ⚙️ Próximas Melhorias Sugeridas

1. Conectar a um backend real (Node.js/Python/PHP)
2. Implementar autenticação com JWT
3. Adicionar OAuth real com Google/Discord/GitHub
4. Envio de email de confirmação
5. Recuperação de senha
6. Dashboard do usuário
7. Autenticação de dois fatores
8. Testes automatizados

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente.

## 👨‍💻 Desenvolvido por

ClipHub Team - 2024

---

**Dicas de Desenvolvimento:**
- Use F12 para abrir o console do navegador e ver mensagens de debug
- A validação em tempo real aparece com mudança de cor na borda dos campos
- Os dados são salvos em localStorage para persistência durante a sessão
- Para resetar dados, use `localStorage.clear()` no console
