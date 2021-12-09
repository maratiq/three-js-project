/**
 * Конструктор для инкапсуляции логики регистрации
 * @param options параметры с которыми вызывается конструктор
 */
function Registration(options) {

    options = options instanceof Object ? options : {};

    const $SELECTORS = options.$SELECTORS;
    const PAGES = options.PAGES;
    const showPage = options.showPage instanceof Function ? options.showPage : () => {};

    const server = options.server;


    /**
     * Функция-регистрация
     * @param e событие нажатия на кнопку
     */
    async function registration(e) {
        e.preventDefault();
        const login = $SELECTORS.modalInputLogin.value;
        const password1 = $SELECTORS.modalInputPass.value;
        console.log(login, password1);
        if (login && password1) {
            const password = md5(login + password1);
            const result = await server.registration({ login, password });
            console.log(result);
            if (result.result === "ok") {
                //loginField.val('');
                //nameField.val('');
                //passwordField.val('');
                //showPage(PAGES.LOGIN);
                return;
            }
            console.log("Пользователь с таким логином уже существует");
            return;
        }
        console.log("Введены не все данные");
    }

    /**
     * Метод-обработчик всех событий, касательно регистрации
     */
    function eventHandler() {
        $SELECTORS.modalRegButton.addEventListener('click', registration);
    }

    /**
     * Функция-инициализатор компонента
     */
    function init () {
        eventHandler();
    }
    init();

}