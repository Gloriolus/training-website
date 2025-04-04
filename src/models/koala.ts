import { Schema, model } from 'mongoose';

// Інтерфейс для об'єкта "Коала"
interface IKoala {
    name: string; // Ім'я коалу
    age: number; // Вік коалу у роках
    height: number; // Висота коалу в сантиметрах
    weight: number; // Вага коалу в кілограмах
    gender: 'male' | 'female'; // Стать коалу: 'male' - самець, 'female' - самка
    description?: string; // Опис коалу (необов'язкове поле)
    dateAdded: Date; // Дата додавання запису до бази даних
}

// Схема MongoDB для моделі "Коала"
const koalaSchema = new Schema<IKoala>({
    name: {
        type: String,
        required: true, // Поле є обов'язковим
    },
    age: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    height: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    weight: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    gender: {
        type: String,
        required: true, // Поле є обов'язковим
        enum: ['male', 'female'], // Допустимі значення: 'male' або 'female'
    },
    description: String, // Необов'язкове текстове поле
    dateAdded: {
        type: Date,
        default: Date.now, // Значення за замовчуванням - поточна дата і час
    },
});

// Створення моделі Mongoose на основі схеми
export const Koala = model<IKoala>('Koala', koalaSchema);
export type { IKoala }; // Експортуємо інтерфейс для використання в інших файлах
