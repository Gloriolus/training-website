import 'reflect-metadata';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';
import { Koala } from '../src/models/koala';
import { container } from '../src/config/container';
import { TYPES } from '../src/types/types';
import { IDatabase } from '../src/interfaces/IDatabase';
import { MONGODB_URI } from '../src/config/env';
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

// Тести API вебдодатку сайту про коал
describe('API вебдодатку сайту про коал', () => {
    // Отримуємо екземпляр бази даних з контейнера
    const database = container.get<IDatabase>(TYPES.IDatabase);
    // Створюємо спеціальний URI для тестової бази даних
    const testMongoURI = MONGODB_URI.replace(/\/[^/]*$/, '/koalas-test');

    // Перед запуском тестів підключаємось до тестової бази даних
    before(async () => {
        await database.connect(testMongoURI);
        console.log('Підключено до тестової бази даних:', testMongoURI);
    });

    // Після всіх тестів очищуємо базу даних і відключаємося
    after(async () => {
        try {
            // Видаляємо тестову базу даних
            await mongoose.connection.db.dropDatabase();
            console.log('Тестову базу даних "koalas-test" успішно видалено');
        } catch (error) {
            // Обробляємо можливі помилки
            console.log(
                'Помилка видалення тестової бази даних:',
                error instanceof Error ? error.message : 'Невідома помилка',
            );
        } finally {
            // В будь-якому разі відключаємося від бази даних
            await database.disconnect();
            console.log('Відключено від тестової бази даних');
        }
    });

    // Тести для перевірки підключення до бази даних
    describe('Підключення до бази даних', () => {
        it('має перевірити підключення до тестової бази даних', () => {
            expect(database.isConnected()).to.be.true;
            expect(database.getConnectionUri()).to.equal(testMongoURI);
            console.log('Підключення до бази даних успішно перевірено');
        });
    });

    // Перед кожним тестом очищуємо колекцію коал
    beforeEach(async () => {
        await Koala.deleteMany({});
    });

    // Тести для створення запису про нового коалу (POST-запит)
    describe('POST /api/koalas', () => {
        it('має створити запис про нового коалу', done => {
            // Тестові дані коалу
            const koala = {
                name: 'Вухань',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'male' as const,
                description: 'Сірий коала',
                eatenEucalyptus: '2 кілограма',
            };

            // Виконуємо POST-запит для створення запису про коалу
            chai.request(app)
                .post('/api/koalas')
                .send(koala)
                .end((err, res) => {
                    if (err !== null && err !== undefined) {
                        return done(err);
                    }
                    // Перевіряємо відповідь
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('name', koala.name);
                    expect(res.body).to.have.property('age', koala.age);
                    expect(res.body).to.have.property('height', koala.height);
                    expect(res.body).to.have.property('weight', koala.weight);
                    expect(res.body).to.have.property('gender', koala.gender);
                    expect(res.body).to.have.property('description', koala.description);
                    expect(res.body).to.have.property('dateAdded');
                    expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
                    done();
                });
        });
    });

    // Тести для отримання всіх записів коал (GET-запит)
    describe('GET /api/koalas', () => {
        it('має отримати всіх коал', async () => {
            // Створюємо тестовий запис коалу
            const testKoala = new Koala({
                name: 'Білан',
                age: 3,
                height: 35,
                weight: 3.2,
                gender: 'male',
                description: 'Білий коала',
                eatenEucalyptus: '2 кілограма',
            });
            await testKoala.save();

            // Виконуємо GET-запит для отримання всіх записів коал
            const res = await chai.request(app).get('/api/koalas');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('name', 'Білан');
            expect(res.body[0]).to.have.property('gender', 'male');
            expect(res.body[0]).to.have.property('description', 'Білий коала');
            expect(res.body[0]).to.have.property('dateAdded');
            expect(new Date(res.body[0].dateAdded)).to.be.instanceOf(Date);
        });
    });

    // Тести для отримання запису конкретного коалу за ID (GET-запит)
    describe('GET /api/koalas/:id', () => {
        it('має отримати конкретного коалу за id', async () => {
            // Створюємо запис тестового коалу
            const testKoala = new Koala({
                name: 'Косий',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Коричневий коала',
                eatenEucalyptus: '2 кілограма',
            });
            const savedKoala = await testKoala.save();

            // Виконуємо GET-запит для отримання запису коалу за ID
            const res = await chai.request(app).get(`/api/koalas/${String(savedKoala._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Косий');
            expect(res.body).to.have.property('age', 1);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Коричневий коала');
        });

        it('має повернути 404 для неіснуючого коалу', async () => {
            // Виконуємо GET-запит для неіснуючого ID коалу
            const res = await chai.request(app).get('/api/koalas/654321654321654321654321');
            expect(res).to.have.status(404);
        });
    });

    // Тести для повного оновлення запису про коалу (PUT-запит)
    describe('PUT /api/koalas/:id', () => {
        it('має повністю оновити запис про коалу', async () => {
            // Створюємо тестового коалу
            const testKoala = new Koala({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                eatenEucalyptus: '2 кілограма',
            });
            const savedKoala = await testKoala.save();

            // Дані для оновлення коалу
            const updatedData = {
                name: 'Оновлений',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'female',
                description: 'Оновлений опис',
                eatenEucalyptus: '2 кілограма',
            };

            // Виконуємо PUT-запит для повного оновлення запису про коалу
            const res = await chai
                .request(app)
                .put(`/api/koalas/${String(savedKoala._id)}`)
                .send(updatedData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            expect(res.body).to.have.property('height', 30);
            expect(res.body).to.have.property('weight', 2.5);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it("має завершитися невдачею при відсутності обов'язкових полів", async () => {
            // Створюємо тестового коалу
            const testKoala = new Koala({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                eatenEucalyptus: '2 кілограма',
            });
            const savedKoala = await testKoala.save();

            // Неповні дані для оновлення (відсутні обов'язкові поля)
            const incompleteData = {
                name: 'Оновлений',
                age: 2,
                // height і weight відсутні
                gender: 'female',
                description: 'Оновлений опис',
                eatenEucalyptus: '2 кілограма',
            };

            // Виконуємо PUT-запит з неповними даними
            const res = await chai
                .request(app)
                .put(`/api/koalas/${String(savedKoala._id)}`)
                .send(incompleteData);

            // Перевіряємо, що запит завершився з помилкою
            expect(res).to.have.status(400);

            // Перевіряємо, що коала не змінився
            const unchangedKoala = await Koala.findById(savedKoala._id);
            expect(unchangedKoala).to.have.property('name', 'Оригінальний');
            expect(unchangedKoala).to.have.property('height', 25);
            expect(unchangedKoala).to.have.property('weight', 1.8);
        });
    });

    // Тести для часткового оновлення запису про коалу (PATCH-запит)
    describe('PATCH /api/koalas/:id', () => {
        it('має частково оновити запис про коалу', async () => {
            // Створюємо тестового коалу
            const testKoala = new Koala({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                eatenEucalyptus: '2 кілограма',
            });
            const savedKoala = await testKoala.save();

            // Дані для часткового оновлення
            const patchData = {
                name: 'Частково оновлений',
                age: 3,
                description: 'Оновлений опис',
                eatenEucalyptus: '2 кілограма',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/koalas/${String(savedKoala._id)}`)
                .send(patchData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Частково оновлений');
            expect(res.body).to.have.property('age', 3);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it('демонструє різницю між PATCH і PUT з частковими оновленнями', async () => {
            // Створюємо тестового коалу
            const testKoala = new Koala({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                eatenEucalyptus: '2 кілограма',
            });
            const savedKoala = await testKoala.save();

            // Ті самі неповні дані, що не спрацювали з PUT, мають працювати з PATCH
            const partialData = {
                name: 'Оновлений',
                age: 2,
                // height і weight навмисно відсутні
                gender: 'female',
                description: 'Оновлений опис',
                eatenEucalyptus: '3 кілограма',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/koalas/${String(savedKoala._id)}`)
                .send(partialData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            expect(res.body).to.have.property('eatenEucalyptus', '3 кілограма');
            // Ці поля мають зберегти свої початкові значення
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
        });
    });

    // Тести для отримання метаданих (HEAD-запит)
    describe('HEAD /api/koalas', () => {
        it('має повернути заголовки метаданих', async () => {
            // Виконуємо HEAD-запит
            const res = await chai
                .request(app)
                .head('/api/koalas')
                .set('Accept', 'application/json');

            // Перевіряємо статус відповіді
            expect(res).to.have.status(200);

            // Виводимо отримані заголовки
            console.log('Заголовки:');
            console.log('-----------------');
            Object.entries(res.headers).forEach(([key, value]) => {
                console.log(`${key}: ${String(value)}`);
            });

            // Перевіряємо наявність необхідних заголовків
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(res.headers['x-powered-by']).to.equal('Express');
            expect(res.headers['content-length']).to.equal('2');
        });
    });

    // Тести для видалення запису коалу (DELETE-запит)
    describe('DELETE /api/koalas/:id', () => {
        it('має видалити запис про коалу', async () => {
            // Створюємо тестового коалу
            const testKoala = new Koala({
                name: 'Стрибунець',
                age: 2,
                height: 28,
                weight: 2.1,
                gender: 'female',
                description: 'Чорний коала',
                eatenEucalyptus: '2 кілограма',
            });
            const savedKoala = await testKoala.save();

            // Виконуємо DELETE-запит
            const res = await chai.request(app).delete(`/api/koalas/${String(savedKoala._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Запис про коалу видалено');

            // Перевіряємо, що запис про коалу дійсно видалено з бази
            const findKoala = await Koala.findById(savedKoala._id);
            expect(findKoala).to.be.null;
        });
    });
});
