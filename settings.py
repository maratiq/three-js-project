SETTINGS = {
    'DB': {
        'PATH': 'application/modules/db/projectDB.db'
    },

    'MEDIATOR': {
        'EVENTS': {
            'GET_STUDENTS_LIST': 'GET_STUDENTS_LIST'  # отправить старосте список студентов на паре
        },
        'TRIGGERS': {
            # О юзерах
            'GET_USERS': 'GET_USERS',
            'GET_ACTIVE_USERS': 'GET_ACTIVE_USERS',
            'GET_USER': 'GET_USER',
            'SET_USER': 'SET_USER',
            'GET_USER_TYPE_BY_TOKEN': 'GET_USER_TYPE_BY_TOKEN',
            'LOGIN': 'LOGIN',
            'LOGOUT': 'LOGOUT',
            # О студентах
            'SET_STUDENT': 'SET_STUDENT',
            'NOTE_STUDENT': 'NOTE_STUDENT',
            'GET_STUDENTS_ON_LESSON': 'GET_STUDENTS_ON_LESSON',
            # О группах
            'GET_GROUPS_CODES': 'GET_GROUPS_CODES',
        }
    },
}