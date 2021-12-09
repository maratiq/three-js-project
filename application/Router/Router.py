from .ApiAnswer import ApiAnswer

class Router:

    web = None
    api = None

    @staticmethod
    def checkParams(method, data):
        if method == 'addUser':
            if 'login' in data.keys() and 'password' in data.keys():
                return True
            return False
        return False

    def __init__(self, app, web, mediator):
        self.web = web
        self.api = ApiAnswer()
        self.mediator = mediator
        self.TYPES = mediator.getEvents()
        self.TRIGGERS = mediator.getTriggers()
        routes = [
            ('*', '/', self.staticHandler),
            # О юзерах
            ('GET', "/api/user", self.getUsers),  # Получить всех юзеров
            ('GET', "/api/user/{login}", self.getUser),  # Получить юзера по логину
            ('GET', "/api/user/type/{token}", self.getUserTypeByToken),  # Получить тип юзера по токену
            ('GET', "/api/user/login/{login}/{password}/{rnd}", self.login),  # Логин юзера
            ('POST', "/api/user", self.register),  # Добавить юзера и студента одновременно

        ]
        app.router.add_static('/img/', path=str('./public/img/'))
        app.router.add_static('/css/', path=str('./public/css/'))
        app.router.add_static('/js/', path=str('./public/js/'))
        for route in routes:
            app.router.add_route(route[0], route[1], route[2])

    def staticHandler(self, request):
        return self.web.FileResponse('./public/index.html')

    def getUserTypeByToken(self, request):
        token = request.match_info.get('token')
        result = self.mediator.get(self.TRIGGERS['GET_USER_TYPE_BY_TOKEN'], {'token': token})
        if result:
            return self.web.json_response(self.api.answer(result))
        return self.web.json_response(self.api.error(404))

    def getUsers(self, request):
        return self.web.json_response(self.api.answer(self.mediator.get(self.TRIGGERS['GET_USERS'])))

    def getUser(self, request):
        login = request.match_info.get('login')
        result = self.mediator.get(self.TRIGGERS['GET_USER'], {'login': login})
        if result:
            result['password'] = ''
            return self.web.json_response(self.api.answer(result))
        return self.web.json_response(self.api.error(404))

    async def register(self, request):
        data = await request.json()
        if self.checkParams('addUser', data):
            result = self.mediator.get(self.TRIGGERS['SET_USER'], data)
            print(result)
            if result:
                return self.web.json_response(self.api.answer(result))
            return self.web.json_response(self.api.error(2000))
        return self.web.json_response(self.api.error(1000))

    def login(self, request):
        print(request)
        login = request.match_info.get('login')
        password = request.match_info.get('password')
        rnd = request.match_info.get('rnd')
        result = self.mediator.get(self.TRIGGERS['LOGIN'], {'login': login, 'password': password, 'rnd': rnd})
        if result:
            return self.web.json_response(self.api.answer(result))
        return self.web.json_response(self.api.error(2010))