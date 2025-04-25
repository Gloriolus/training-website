import { injectable } from 'inversify';
import { Koala, IKoala } from '../models/koala';

// Клас-репозиторій для роботи з коалуми
// Анотація injectable дозволяє впровадити цей репозиторій через IoC контейнер
@injectable()
export class KoalaRepository {
    // Метод для отримання всіх коал з бази даних
    public async findAll(): Promise<IKoala[]> {
        return Koala.find();
    }

    // Метод для пошуку коали за унікальним ідентифікатором
    public async findById(id: string): Promise<IKoala | null> {
        return Koala.findById(id);
    }

    // Метод для створення нової коали в базі даних
    public async create(koalaData: IKoala): Promise<IKoala> {
        const koala = new Koala(koalaData);
        return koala.save();
    }

    // Метод для видалення коал за ідентифікатором
    public async delete(id: string): Promise<boolean> {
        const result = await Koala.findByIdAndDelete(id);
        return result !== null;
    }

    // Метод для повного оновлення даних про коалу (заміна всіх полів)
    public async update(id: string, koalaData: IKoala): Promise<IKoala | null> {
        return Koala.findByIdAndUpdate(id, koalaData, { new: true });
    }

    // Метод для часткового оновлення даних про коалу (оновлення лише вказаних полів)
    public async patch(id: string, koalaData: Partial<IKoala>): Promise<IKoala | null> {
        return Koala.findByIdAndUpdate(id, { $set: koalaData }, { new: true });
    }
}
