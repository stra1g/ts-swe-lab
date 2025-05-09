import { randomUUID } from 'node:crypto';

export interface BaseEntityProps {
  createdAt: Date;
  updatedAt: Date;
  version: number;
  isDeleted: boolean;
  deletedAt: Date | null;
}

export abstract class Entity<T> {
  protected readonly _id: string;
  protected readonly props: T & BaseEntityProps;

  constructor(props: T, id?: string) {
    this._id = id || randomUUID();
    this.props = {
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0,
      isDeleted: false,
      deletedAt: null,
    };
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get version(): number {
    return this.props.version;
  }

  get isDeleted(): boolean {
    return this.props.isDeleted;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  protected updated(): void {
    this.props.updatedAt = new Date();
    this.props.version++;
  }

  protected delete(): void {
    this.props.isDeleted = true;
    this.props.deletedAt = new Date();
    this.updated();
  }
}
