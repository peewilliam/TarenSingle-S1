export class ResetPasswordForm {
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
        const resetForm = document.createElement('form');
        resetForm.className = 'login-form';
        resetForm.id = 'resetForm';
        resetForm.autocomplete = 'off';
        resetForm.spellcheck = 'false';
        resetForm.dataLpignore = 'true';
        
        resetForm.innerHTML = `
            <!-- Campo oculto para enganar o Chrome -->
            <div style="display:none">
                <input type="text" name="hidden_username" />
                <input type="password" name="hidden_password" />
            </div>
            <div class="form-group">
                <div class="input-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <input type="text" 
                       id="resetEmailInput" 
                       name="random_resetemail_${Math.random()}"
                       placeholder="SEU E-MAIL"
                       autocomplete="chrome-off"
                       readonly
                       onfocus="this.removeAttribute('readonly');"
                       data-lpignore="true"
                       data-form-type="other"
                       autocapitalize="off"
                       autocorrect="off"
                       spellcheck="false"
                       required
                       pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
            </div>
            <button type="submit" class="login-button">
                <span class="button-text">RECUPERAR SENHA</span>
            </button>
            <div class="footer-links">
                <a href="#" class="back-to-login" id="backToLoginFromReset">Voltar para o Login</a>
            </div>`;

        return resetForm;
    }

    setupEvents(form) {
        const backButton = form.querySelector('#backToLoginFromReset');
        if (backButton) {
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.loginScene.restoreLoginForm();
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('#resetEmailInput').value;
            
            if (!email) {
                this.loginScene.showError('Por favor, insira seu e-mail');
                return;
            }
            
            // Aqui você pode adicionar a lógica para enviar o e-mail de recuperação
            console.log('Recuperação de senha solicitada para:', email);
            this.loginScene.showSuccess('E-mail de recuperação enviado!');
            
            // Volta para o formulário de login após alguns segundos
            setTimeout(() => {
                this.loginScene.restoreLoginForm();
            }, 2000);
        });
    }
}
