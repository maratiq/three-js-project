# Описание базового менеджера.
# Здесь прописываются все параметры, которые должны быть у каждого менеджера


class BaseManager:
    db = None
    mediator = None
    TRIGGERS = None
    EVENTS = None
    SOCKET_EVENTS = None
    socket = None

    def __init__(self, params):
        self.mediator = params['mediator']
        self.db = params['db']
        self.TRIGGERS = self.mediator.getTriggers()
        self.EVENTS = self.mediator.getEvents()

