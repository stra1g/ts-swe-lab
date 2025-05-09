export interface BaseRepository<T> {
  /**
   * Finds an entity by its ID
   * @param id The ID of the entity to find
   */
  findById(id: string): Promise<T | null>;

  /**
   * Creates a new entity in the repository
   * @param entity The entity to create
   */
  create(entity: T): Promise<void>;

  /**
   * Updates an existing entity in the repository
   * @param entity The entity to update
   */
  update(entity: T): Promise<void>;

  /**
   * Deletes an entity from the repository
   * @param id The ID of the entity to delete
   */
  delete(id: string): Promise<void>;
}
