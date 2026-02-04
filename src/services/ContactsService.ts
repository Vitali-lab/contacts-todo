export class ContactsService {
  get() {
    const contacts = localStorage.getItem("contacts");
    if (contacts) {
      return JSON.parse(contacts);
    }
    return [];
  }
}
