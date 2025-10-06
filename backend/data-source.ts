import 'reflect-metadata';
import { AppDataSource } from '../typeorm.config';

export async function connectDatabase() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
    console.log("Database connected")
  }
}
