import iconExit from "../icons/Vector.svg?raw";
import iconArrow from "../icons/arrow-down.svg?raw";
import type { Group } from "../types";
function renderLeftMenu(groups: Group[]): string {
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
           <input id="contact-number" type="tel" placeholder="Введите номер"/>
           <div class="left-menu-add__custom-select">
           <div class="left-menu-add__select">
           <p>Выберите группу</p>
           <button class="left-menu-add__button_arrow">${iconArrow}</button>
           </div>
           <div class="left-menu-add__options">
           ${groups.length === 0 ? "<div>Нет групп</div>" : groups.map((group) => `<div class="left-menu-add__option" data-id="${group.id}">${group.name}</div>`).join("")}
           </div>
           </div>
           </main>
           <footer class="left-menu-add__footer">
           <button id="add-new-contact" class="left-menu-add__button_save">Сохранить</button>
           </footer>
        </aside>
    `;
}

export { renderLeftMenu };
