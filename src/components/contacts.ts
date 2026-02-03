import type { Contact, Group } from "../types";
import iconArrowDown from "../icons/arrow-down.svg?raw";
import iconPencil from "../icons/pencil.svg?raw";
import iconBacket from "../icons/basket.svg?raw";

function renderContacts(contacts: Contact[], groups: Group[]): string {
  return `
        <main class="main">
            <div class="main__container">
              ${
                contacts.length === 0
                  ? "<p>Список контактов пуст</p>"
                  : groups
                      .map(
                        (groups) => `
              <div class="group-list">
                 <div class="group">
                 <h3 class="group__name">${groups.name}</h3>
                 <button id="arrow-down"  class = "arrow-button">${iconArrowDown}</button>
                 </div>
                 <div class="contacts">
              ${
                contacts
                  .filter((contact) => contact.groupId === groups.id)
                  .map((contact) => {
                    return `
                <div data-id="${contact.id}" class="contact-list">
                <div class="contact-list__info">
                <p class="contact-list__name">${contact.name}</p>
                <p class="contact-list__phone">${contact.phone}</p>
                </div>
                  <div class="contact-list__buttons">
                  <button class="edit-button">${iconPencil}</button>
                  <button class="delete-button">${iconBacket}</button>
                  </div>
                  </div>
                  `;
                  })
                  .join("") ||
                "<div class='contact-list'>Список контактов пуст</div>"
              }
              </div>
              </div>
              
              
              `,
                      )
                      .join("")
              }
            </div>
        </main>
    `;
}

export { renderContacts };
