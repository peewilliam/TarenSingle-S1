class LoginForm {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        this.container.className = 'login-container';
        this.createForm();
    }

    createForm() {
        const formHeader = this.createHeader();
        const usernameGroup = this.createInputGroup('text', 'Nome de usuário', 'username');
        const passwordGroup = this.createInputGroup('password', 'Senha', 'password');
        const loginButton = this.createLoginButton();
        const options = this.createOptions();

        this.container.appendChild(formHeader);
        this.container.appendChild(usernameGroup);
        this.container.appendChild(passwordGroup);
        this.container.appendChild(loginButton);
        this.container.appendChild(options);
    }

    createHeader() {
        const formHeader = document.createElement('div');
        formHeader.className = 'form-header';

        const title = document.createElement('h2');
        title.textContent = 'Login';

        const decoration = document.createElement('div');
        decoration.className = 'header-decoration';

        formHeader.appendChild(title);
        formHeader.appendChild(decoration);

        return formHeader;
    }

    createInputGroup(type, placeholder, name) {
        const group = document.createElement('div');
        group.className = 'input-group';

        const input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder;
        input.name = name;
        input.required = true;

        group.appendChild(input);
        return group;
    }

    createLoginButton() {
        const button = document.createElement('button');
        button.type = 'submit';
        button.className = 'login-button';
        button.innerHTML = '<span>Entrar no Jogo</span>';
        return button;
    }

    createOptions() {
        const options = document.createElement('div');
        options.className = 'login-options';

        const forgotPassword = document.createElement('a');
        forgotPassword.href = '#';
        forgotPassword.className = 'forgot-password';
        forgotPassword.textContent = 'Esqueceu a senha?';

        const createAccount = document.createElement('a');
        createAccount.href = '#';
        createAccount.className = 'create-account';
        createAccount.textContent = 'Criar conta';

        options.appendChild(forgotPassword);
        options.appendChild(createAccount);

        return options;
    }
}

export default LoginForm;
