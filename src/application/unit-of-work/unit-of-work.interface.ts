import { UserRepositoryInterface } from '../../domain/user/repositories/user-repository.interface';

/**
 * The UnitOfWork pattern manages transaction boundaries and ensures
 * all operations within a business transaction either complete successfully
 * or fail completely.
 */
export interface UnitOfWork {
  getUserRepository(): UserRepositoryInterface;

  /**
   * Begin a new transaction
   */
  beginTransaction(): Promise<void>;

  /**
   * Commit the current transaction
   */
  commitTransaction(): Promise<void>;

  /**
   * Rollback the current transaction
   */
  rollbackTransaction(): Promise<void>;

  /**
   * Perform operations in a transaction and automatically commit or rollback
   * @param work The work to be performed in the transaction
   */
  execute<T>(work: () => Promise<T>): Promise<T>;
}
