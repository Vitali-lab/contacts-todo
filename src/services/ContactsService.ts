import type { Contact } from "../types";
import { StorageService } from "./StorageServise";

export class ContactsService {
  private storage = new StorageService<Contact>("contacts");

  getAll(): Contact[] {
    return this.storage.get();
  }

  getById(id: string): Contact | undefined {
    return this.storage.get().find((c) => c.id === id);
  }

  add(contact: Contact): void {
    const contacts = this.getAll();
    this.storage.set([...contacts, contact]);
  }

  update(id: string, data: Partial<Contact>): void {
    const updated = this.getAll().map((contact) =>
      contact.id === id ? { ...contact, ...data } : contact,
    );

    this.storage.set(updated);
  }

  remove(id: string): void {
    const filtered = this.getAll().filter((c) => c.id !== id);
    this.storage.set(filtered);
  }

  clear(): void {
    this.storage.set([]);
  }
}
