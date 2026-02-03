import iconExit from "../icons/Vector.svg?raw";
import type { Contact, Group } from "../types";
function renderLeftMenu(contacts: Contact[], groups: Group[]): string {
  return `
        <aside class="left-menu-add">
           <header class="left-menu-add__header">
           <h3>Добавление контакта</h3>
           <button id="close-menu" class="left-menu-add__button">
           ${iconExit}
           </button>
           </header>
           <main class="left-menu-add__main">
           <input id="contact-name" type="text" placeholder="Введите ФИО"/>
           <input id="contact-number" type="number" placeholder="Введите Введите номер"/>
           <select id="contact-group" placeholder="Выберите группу"> 
           ${groups.length === 0 ? "<option>Нет групп</option>" : groups.map((group) => `<option value="${group.id}">${group.name}</option>`).join("")}
           </select>
           </main>
           <footer class="left-menu-add__footer">
           <button id="add-new-contact" class="left-menu-add__button_save">Сохранить</button>
           </footer>
        </aside>
    `;
}

export { renderLeftMenu };
