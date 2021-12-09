import sqlite3


# Класс для работы с базой данных.
# Все запросы прописываются здесь
class DB:

    conn = None

    def __init__(self, settings):
        self.conn = sqlite3.connect(settings['PATH'])
        self.conn.row_factory = self.dictFactory
        self.c = self.conn.cursor()

    def __del__(self):
        self.conn.close()

    @staticmethod
    def dictFactory(cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d

    def getUserByLogin(self, login):
        query = 'SELECT * FROM user WHERE login=:login'
        self.c.execute(query, {'login': login})
        return self.c.fetchone()

    def getUserByToken(self, token):
        query = 'SELECT id FROM user WHERE token=:token'
        self.c.execute(query, {'token': token})
        return self.c.fetchone()

    def getUsers(self):
        query = 'SELECT * FROM user'
        self.c.execute(query)
        return self.c.fetchall()

    def setToken(self, id, token=None):
        query = 'UPDATE user SET token=:token WHERE id=:id'
        self.c.execute(query, {"token": token, "id": id})
        self.conn.commit()

    def addUser(self, data):
        query = 'INSERT INTO user (login, password) VALUES (:login, :password)'
        try:
            self.c.execute(query, {'login': data['login'], 'password': data['password']})
            self.conn.commit()
        except sqlite3.IntegrityError:
            return False
        user = self.getUserByLogin(data['login'])
        return user

    def getResult(self, user_id):
        query = 'SELECT * FROM result WHERE user_id=:user_id'
        self.c.execute(query)
        return self.c.fetchall()

    def addResult(self, data):
        query = 'INSERT INTO result (user_id, ruleset, tape, head, output) ' \
                'VALUES (:user_id, :ruleset, :tape, ;head, :output)'
        try:
            self.c.execute(query, {'user_id': data['user_id'],
                                   'ruleset': data['ruleset'],
                                   'tape': data['tape'],
                                   'head': data['head'],
                                   'output': data['output']})
            self.conn.commit()
        except sqlite3.IntegrityError:
            return False
        user = self.getResult(data['user_id'])
        return user
