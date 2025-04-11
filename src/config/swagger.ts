// Експорт специфікації Swagger/OpenAPI для документації про API
export const swaggerSpec = {
    // Версія специфікації OpenAPI
    openapi: '3.0.0',
    // Загальна інформація про API
    info: {
        title: 'API Сайту про Коал',
        version: '1.0.0',
        description: 'Документація API для Сайту про Коал',
    },
    // Налаштування серверів для тестування API
    servers: [
        {
            url:
                process.env.CODESPACE_NAME !== undefined
                    ? `https://${process.env.CODESPACE_NAME}-5000.app.github.dev`
                    : 'http://localhost:5000',
            description: 'Development server',
        },
    ],
    // Визначення роутерів API та операцій з ними
    paths: {
        '/api/koalas': {
            // GET запит для отримання всіх коал
            get: {
                summary: 'Отримати всіх коал',
                responses: {
                    '200': {
                        description: 'Список всіх коал',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Koala' },
                                },
                            },
                        },
                    },
                },
            },

            // POST запит для створення нового коалу
            post: {
                summary: 'Створити нового коалу',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Koala' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: "Створений об'єкт коалу",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Koala' },
                            },
                        },
                    },
                },
            },
        },

        // Операції для конкретного коалу за ID
        '/api/koalas/{id}': {
            // GET запит для отримання коалу за ID
            get: {
                summary: 'Отримати коалу за ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID коалу',
                        eatenEucalyptus: '',
                    },
                ],
                responses: {
                    '200': {
                        description: "Об'єкт коалу",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Koala' },
                            },
                        },
                    },
                    '404': { description: 'Коалу не знайдено' },
                },
            },

            // PUT запит для повного оновлення коалу за ID
            put: {
                summary: 'Повністю оновити коалу',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID коалу',
                        eatenEucalyptus: '',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Koala' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт коалу",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Koala' },
                            },
                        },
                    },
                    '404': { description: 'Коалу не знайдено' },
                },
            },
            // PATCH запит для часткового оновлення коалу за ID
            patch: {
                summary: 'Частково оновити коалу',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID коалу',
                        eatenEucalyptus: '',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Koala' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт коалу",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Koala' },
                            },
                        },
                    },
                    '404': { description: 'Коалу не знайдено' },
                },
            },
            // DELETE запит для видалення даних про коалу за ID
            delete: {
                summary: 'Видалити дані про коалу',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID коалу',
                        eatenEucalyptus: '',
                    },
                ],
                responses: {
                    '200': { description: 'Повідомлення про успішне видалення' },
                    '404': { description: 'Коалу не знайдено' },
                },
            },
        },
    },

    // Визначення компонентів для повторного використання
    components: {
        // Схеми даних
        schemas: {
            // Схема об'єкта Коала
            Koala: {
                type: 'object',
                required: ['name', 'age', 'height', 'weight', 'gender'],
                properties: {
                    name: {
                        type: 'string',
                        description: "Ім'я коалу",
                    },
                    age: {
                        type: 'number',
                        description: 'Вік коалу у роках',
                    },
                    height: {
                        type: 'number',
                        description: 'Висота коалу в сантиметрах',
                    },
                    weight: {
                        type: 'number',
                        description: 'Вага коалу в кілограмах',
                    },
                    gender: {
                        type: 'string',
                        enum: ['male', 'female'],
                        description: 'Стать коалу',
                    },
                    description: {
                        type: 'string',
                        description: "Опис коалу (необов'язкове поле)",
                    },
                    eatenEucalyptus: {
                        type: 'string',
                        description: 'Кількість зїдання  евкалипта в день',
                    },
                },
            },
        },
    },
};
