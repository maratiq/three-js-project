window.onload = function () {

    const PAGES = SETTINGS.PAGES;

    //Константа со всеми базовыми селекторами
    const $SELECTORS = {
        'mainBlock': document.getElementsByClassName('main-container')[0],
        'authButton': document.getElementsByClassName('auth-button')[0],
        'authMenuBlock': document.getElementsByClassName('auth-menu-block')[0],
        'modal': document.getElementsByClassName('modal-container')[0],
        'modalCloseButton': document.getElementsByClassName('modal__close-button')[0],
        'modalInputLogin': document.getElementsByClassName('modal__input-login')[0],
        'modalInputPass': document.getElementsByClassName('modal__input-pass')[0],
        'modalAuthButton': document.getElementsByClassName('modal__submit-button')[0],
        'modalRegButton': document.getElementsByClassName('modal__reg-button')[0],
        'additionalMenuBlock': document.getElementsByClassName('additional-menu-container')[0],
    };

    /**
     * Метод показывающий нужную страницу по запросу
     * @param page страница, которую нужно показать
     */
    function showPage(page) {
        $SELECTORS.mainBlock.classList.add('disabled');
        $SELECTORS.mainBlock.classList.remove('disabled');

        $SELECTORS.authMenuBlock.classList.add('disabled');

        switch (page) {
            case PAGES.LOGIN_BLOCK:
                $SELECTORS.authMenuBlock.classList.remove('disabled');
                break;
            case PAGES.ADDITIONAL_MENU_BLOCK:
                $SELECTORS.additionalMenuBlock.classList.remove('disabled');
                break;

        }
    }

    const mediator = new Mediator({ ...SETTINGS.MEDIATOR });
    const server = new Server({ ...SETTINGS });

    new Login({ ...SETTINGS, $SELECTORS, showPage, server, mediator })
    new Registration({ ...SETTINGS, $SELECTORS, showPage, server, mediator })

    showPage(PAGES.LOGIN_BLOCK);
};