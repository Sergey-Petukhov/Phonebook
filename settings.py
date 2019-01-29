MONGO_URI = "mongodb://user:password@mongo_adress/db_name"

RESOURCE_METHODS = ['GET', 'POST']
ITEM_METHODS = ['GET']
X_DOMAINS = '*'
VALIDATION_ERROR_STATUS = 200
CACHE_CONTROL = 'max-age=5'
CACHE_EXPIRES = 5

DOMAIN = {
    'contacts': {
        'schema': {
            'name': {
                'type': 'string',
                'regex': '^[а-яА-ЯёЁa-zA-Z]+[а-яА-ЯёЁa-zA-Z\s\d\-\—]*$',
                'minlength': 1,
                'maxlength': 50,
                'required': True,
                'unique': True
            },
            'name_in_lowercase': {
                'type': 'string',
                'regex': '^[а-яА-ЯёЁa-zA-Z]+[а-яА-ЯёЁa-zA-Z\s\d\-\—]*$',
                'minlength': 1,
                'maxlength': 50,
                'required': True,
                'unique': True
            },
            'phone': {
                'type': 'string',
                'regex': '^[\+\(]?[\d]{1,5}[\-\s\/\)]?[\(\s]?[\d]{0,5}[\)]?[\-\s\/\.]?[\d]{0,5}[\-\s\/\.]?[\d]{0,5}[\-\s\/\.]?[\d]{0,5}$',
                'minlength': 1,
                'maxlength': 50,
                'required': True,
                'unique': True
            }
        }
    }
}
