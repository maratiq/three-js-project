function Login(options) {
    options = options instanceof Object ? options : {};

    const $SELECTORS = options.$SELECTORS;
    const PAGES = options.PAGES;
    const showPage = options.showPage instanceof Function ? options.showPage : () => {};

    const mediator = options.mediator;
    const EVENTS = mediator.EVENTS;
    const TRIGGERS = mediator.TRIGGERS;

    const server = options.server;

    async function login(e) {
        e.preventDefault();
        const loginValue = $SELECTORS.modalInputLogin.value;
        let passValue = $SELECTORS.modalInputPass.value;
        if (loginValue && passValue) {
            const rnd = Math.random();
            passValue = md5(md5(loginValue + passValue) + rnd);
            console.log(loginValue, passValue, rnd)
            const result = await server.login({loginValue, passValue, rnd});
            if (result.result === 'ok') {
                server.token = result.data;
                //loginField.val('');
                //passwordField.val('');
                localStorage.setItem('token', server.token);
                //$('.auth-reg-block__error-login-js').empty();
                showPage(PAGES.LOGOUT_BLOCK);
                showPage(PAGES.ADDITIONAL_MENU_BLOCK);
                return;
            }
            //$('.auth-reg-block__error-login-js').empty().append("Неверные логин и(или) пароль!");
            console.log('Неверные логин и(или) пароль!');
            return;
        }
        console.log('Не введен логин и(или) пароль!');
    }


    function showModal() {
        $SELECTORS.modal.classList.remove('disabled');
    }

    function hideModal() {
        $SELECTORS.modal.classList.add('disabled');
    }


    function eventHandler() {
        $SELECTORS.authButton.addEventListener('click', showModal);
        $SELECTORS.modalCloseButton.addEventListener('click', hideModal);
        $SELECTORS.modalAuthButton.addEventListener('click', login)
    }

    function init() {
        eventHandler();
    }

    init();

}