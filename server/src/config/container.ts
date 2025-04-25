import 'reflect-metadata';
import { Container } from 'inversify';
import { IDatabase } from '../interfaces/IDatabase';
import { MongoDatabase } from '../database/MongoDatabase';
import { KoalaRepository } from '../repositories/KoalaRepository';
import { TYPES } from '../types/types';
import { NODE_ENV } from './env';

// Інтерфейс для об'єкта конфігурації
export interface IConfig {
    nodeEnv: string; // Середовище виконання: development, production, test тощо
}

// Створюємо контейнер інверсії залежностей (IoC)
const container = new Container();

// Зв'язуємо об'єкт конфігурації як константне значення
container.bind<IConfig>('Config').toConstantValue({
    nodeEnv: NODE_ENV,
});

// Зв'язуємо інтерфейс бази даних з його реалізацією як одиночний екземпляр (singleton)
container.bind<IDatabase>(TYPES.IDatabase).to(MongoDatabase).inSingletonScope();

// Пряме зв'язування конкретного класу KoalaRepository як одиночного екземпляру
container.bind(KoalaRepository).toSelf().inSingletonScope();

export { container };
