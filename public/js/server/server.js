/**
 * Компонент для отправки запросов на сервер и получения ответов
 */
class Server {

    /**
     * Функция-конструктор компонента
     * @param options начальные параметры, с которыми вызывается конструктор
     */
    constructor(options) {
        this.options = options instanceof Object ? options : {};
        this.url = options.URL;
        this.token = null;
    }

    /**
     * Метод, выполняющий любой GET-запрос на сервер
     * @param data данные, с которыми нужно выполнить этот запрос
     * @returns {Promise<any>} результат выполнения запроса
     */
    executeGet(data) {
        return new Promise(resolve => {
            $.ajax({
                url: this.url + data.url,
                method: 'GET',
                dataType: 'json',
                success: data => resolve(data)
            });
        });
    }

    /**
     * Метод, выполняющий любой POST-запрос на сервер
     * @param data данные, с которыми нужно выполнить этот запрос
     * @returns {Promise<any>} результат выполнения запроса
     */
    executePost(data) {
        return new Promise(resolve => {
            $.ajax({
                url: this.url + data.url,
                data: JSON.stringify(data),
                method: 'POST',
                dataType: 'json',
                success: data => resolve(data)
            });
        });
    }

    /**
     * Метод отправки запроса login на сервер
     * @param data данные с которыми нужно отправить запрос
     * @returns {Promise<any>} результат запроса
     */
    login(data = {}) {
        console.log(data);
        data.url = `user/login/${data.loginValue}/${data.passValue}/${data.rnd}`;
        return this.executeGet(data);
    }

    /**
     * Метод отправки запроса logout на сервер
     * @param data данные с которыми нужно отправить запрос
     * @returns {Promise<any>} результат запроса
     */
    logout(data = {}) {
        data.url = `user/logout/${this.token}`;
        return this.executeGet(data);
    }

    /**
     * Метод отправки запроса registration на сервер
     * @param data данные с которыми нужно отправить запрос
     * @returns {Promise<any>} результат запроса
     */
    registration(data = {}) {
        data.url = 'user';
        return this.executePost(data);
    }

    /**
     * Метод отправки запроса getGroupsCodes на сервер
     * @param data данные с которыми нужно отправить запрос
     * @returns {Promise<any>} результат запроса
     */
    getGroupsCodes(data = {}) {
        data.url = 'group/codes';
        return this.executeGet(data);
    }

    /**
     * Метод, возвращающий тип пользователя по токену пользователя
     * @param data данные необходимые для отправки запроса
     * @returns {Promise<any>} результат запроса
     */
    getUserType(data = {}) {
        data.url = `user/type/${this.token}`;
        return this.executeGet(data);
    }

    /**
     * Получить студентов на паре
     * @param data данные необходимые для отправки запроса
     * @returns {Promise<any>}
     */
    getStudentsOnLesson(data = {}) {
        data.url = `student/getOnLesson/${this.token}/${data.date}/${data.lessonNum}`;
        return this.executeGet(data);
    }

    /**
     * Отметить студента на паре
     * @param data - {code}
     * @returns {Promise<any>}
     */
    noteStudent(data = {}) {
        console.log(data);
        data.url = `student/note/${data.code}/${this.token}`;
        return this.executeGet(data)
    }

}