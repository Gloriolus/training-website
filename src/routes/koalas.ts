import { Router, Request, Response } from 'express';
import { container } from '../config/container';
import { KoalaRepository } from '../repositories/KoalaRepository';

// Створюємо новий роутер Express
const router = Router();
// Отримуємо екземпляр репозиторію коал з контейнера інверсії залежностей
const koalaRepository = container.get(KoalaRepository);

// Роутер для HTTP метода GET / - отримання всіх записів коал
router.get('/', (async (_req: Request, res: Response) => {
    try {
        // Отримуємо всі записи коал з бази даних через репозиторій
        const koalas = await koalaRepository.findAll();
        res.json(koalas);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода GET /:id - отримання запису одного коалу за ідентифікатором
router.get('/:id', (async (req: Request, res: Response) => {
    try {
        // Пошук коалу за ідентифікатором
        const koala = await koalaRepository.findById(req.params.id);
        if (koala) {
            res.json(koala);
        } else {
            // Якщо коала не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис коалу не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода POST / - створення нового запису коалу
router.post('/', (async (req: Request, res: Response) => {
    try {
        // Створюємо новий запис коалу з даних запиту
        const newKoala = await koalaRepository.create(req.body);
        // Повертаємо статус 201 (Created) і дані створеного коалу
        res.status(201).json(newKoala);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода PUT /:id - повне оновлення запису коалу
router.put('/:id', (async (req: Request, res: Response) => {
    try {
        // Перевірка наявності всіх обов'язкових полів для PUT запиту
        const requiredFields = ['name', 'age', 'height', 'weight', 'gender'];
        const missingFields = requiredFields.filter(field => !(field in req.body));

        // Якщо є відсутні поля, повертаємо помилку 400 Bad Request
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Відсутні обов'язкові поля: ${missingFields.join(', ')}`,
            });
        }

        // Оновлюємо коалу з вказаним ID
        const koala = await koalaRepository.update(req.params.id, req.body);
        if (koala) {
            return res.json(koala);
        } else {
            // Якщо коала не знайдений, повертаємо 404 помилку
            return res.status(404).json({ message: 'Запис коалу не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        return res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода PATCH /:id - часткове оновлення запису коалу
router.patch('/:id', (async (req: Request, res: Response) => {
    try {
        // Часткове оновлення запису коалу - передаються лише ті поля, які потрібно змінити
        const koala = await koalaRepository.patch(req.params.id, req.body);
        if (koala) {
            res.json(koala);
        } else {
            // Якщо коала не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис коалу не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода DELETE /:id - видалення запису коалу
router.delete('/:id', (async (req: Request, res: Response) => {
    try {
        // Видаляємо дані про коалу за ID
        const koala = await koalaRepository.delete(req.params.id);
        if (koala) {
            // У разі успіху повертаємо повідомлення про видалення
            res.json({ message: 'Запис про коалу видалено' });
        } else {
            // Якщо коала не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис про коалу не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

export default router;
