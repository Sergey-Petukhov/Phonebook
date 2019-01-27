MONGO_URI = "mongodb://usen:password@mongo_adress/db_name"

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
		'regex': '^\s*[а-яА-ЯёЁa-zA-Z]+[а-яА-ЯёЁa-zA-Z\s]*$',
                'minlength': 1,
                'maxlength': 50,
                'required': True,
                'unique': True
            },
            'phone': {
                'type': 'string',
		'regex': '^\s*[\+\(]?[\d]{1,5}[\-\s\/\)]?[\(\s]?[\d]{0,5}[\)]?[\-\s\/\.]?[\d]{0,5}[\-\s\/\.]?[\d]{0,5}[\-\s\/\.]?[\d]{0,5}\s*$',
                'minlength': 1,
                'maxlength': 50,
                'required': True,
		'unique': True
            }
        }
    }
}
