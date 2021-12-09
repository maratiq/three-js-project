from aiohttp import web
from settings import SETTINGS


from application.Mediator import Mediator
from application.modules.db.DB import DB
from application.modules.managers.UserManager import UserManager
from application.Router.Router import Router

mediator = Mediator(SETTINGS['MEDIATOR'])
db = DB(SETTINGS['DB'])

UserManager({'mediator': mediator, 'db': db})

app = web.Application()
Router(app, web, mediator)
web.run_app(app)

