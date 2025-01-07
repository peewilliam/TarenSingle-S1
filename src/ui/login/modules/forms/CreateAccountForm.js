export class CreateAccountForm {
    constructor(loginScene) {
        this.loginScene = loginScene;
    }

    mount(container) {
        const form = this.create();
        const logoContainer = container.querySelector('.logo-container');
        
        // Insere o formulário após o logo-container
        if (logoContainer && logoContainer.nextSibling) {
            container.insertBefore(form, logoContainer.nextSibling);
        } else {
            container.appendChild(form);
        }
        
        this.setupEvents(form);
        return form;
    }

    create() {
        const createForm = document.createElement('form');
        createForm.className = 'login-form';
        createForm.id = 'createAccountForm';
        createForm.autocomplete = 'off';
        createForm.spellcheck = 'false';
        createForm.dataLpignore = 'true';
        
        createForm.innerHTML = `
            <!-- Campo oculto para enganar o Chrome -->
            <div style="display:none">
                <input type="text" name="hidden_username" />
                <input type="password" name="hidden_password" />
            </div>
            <div class="form-group">
                <div class="input-icon">
                    <i class="fas fa-user"></i>
                </div>
                <input type="text" 
                       id="createUsername" 
                       name="random_username_${Math.random()}"
                       placeholder="USUÁRIO"
                       autocomplete="chrome-off"
                       readonly
                       onfocus="this.removeAttribute('readonly');"
                       data-lpignore="true"
                       data-form-type="other"
                       autocapitalize="off"
                       autocorrect="off"
                       spellcheck="false"
                       required>
            </div>
            <div class="form-group">
                <div class="input-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <input type="email" 
                       id="createEmail" 
                       name="random_email_${Math.random()}"
                       placeholder="E-MAIL"
                       autocomplete="chrome-off"
                       readonly
                       onfocus="this.removeAttribute('readonly');"
                       data-lpignore="true"
                       data-form-type="other"
                       autocapitalize="off"
                       autocorrect="off"
                       spellcheck="false"
                       required>
            </div>
            <div class="form-group">
                <div class="input-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <input type="password" 
                       id="createPassword" 
                       name="random_password_${Math.random()}"
                       placeholder="SENHA"
                       autocomplete="chrome-off"
                       readonly
                       onfocus="this.removeAttribute('readonly');"
                       data-lpignore="true"
                       data-form-type="other"
                       required>
            </div>
            <div class="form-group">
                <div class="input-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <input type="password" 
                       id="confirmPassword" 
                       name="random_confirm_${Math.random()}"
                       placeholder="CONFIRMAR SENHA"
                       autocomplete="chrome-off"
                       readonly
                       onfocus="this.removeAttribute('readonly');"
                       data-lpignore="true"
                       data-form-type="other"
                       required>
            </div>
            <button type="submit" class="login-button">
                <span class="button-text">CRIAR CONTA</span>
            </button>
            <div class="footer-links">
                <a href="#" class="back-to-login" id="backToLoginFromCreate">Voltar para o Login</a>
            </div>`;

        return createForm;
    }

    setupEvents(form) {
        const backButton = form.querySelector('#backToLoginFromCreate');
        if (backButton) {
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.loginScene.restoreLoginForm();
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = form.querySelector('#createUsername').value;
            const email = form.querySelector('#createEmail').value;
            const password = form.querySelector('#createPassword').value;
            const confirmPassword = form.querySelector('#confirmPassword').value;
            
            if (!username || !email || !password || !confirmPassword) {
                this.loginScene.showError('Por favor, preencha todos os campos');
                return;
            }
            
            if (password !== confirmPassword) {
                this.loginScene.showError('As senhas não coincidem');
                return;
            }
            
            // Aqui você pode adicionar a lógica para criar a conta
            console.log('Criando conta:', { username, email });
            this.loginScene.showSuccess('Conta criada com sucesso!');
            
            // Volta para o formulário de login após alguns segundos
            setTimeout(() => {
                this.loginScene.restoreLoginForm();
            }, 2000);
        });
    }
}
