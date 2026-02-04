import iconExit from "../icons/Vector.svg?raw";
import iconBasket from "../icons/basket.svg?raw";
import type { Group } from "../types";
function renderGroups(groups: Group[]): string {
  return `
        <aside class="groups">
           <header class="groups__header">
           <h3>Группы контактов</h3>
           <button id="close-groups" class="groups__button_close">
           ${iconExit}
           </button>
           </header>
           <main class="groups__main">
           <ul class="groups__list">
        ${groups
          .map(
            (group) => `
              <div class="group">
              <li class="groups__item" data-id="${group.id}">
                ${group.name}
              </li>
              <button data-group-id="${group.id}" class="groups__button_delete">${iconBasket}</button>
              </div>
            `,
          )
          .join("")}
      </ul>
           <div class="group">
           <input id="group-name" type="text" placeholder="Введите название "/>
           
           </div>
           </main>
           <footer class="groups__footer">
           <button id="add-group" class="groups__button">Добавить</button>
           <button class="groups__button_save">Сохранить</button>
           </footer>
        </aside>
    `;
}

export { renderGroups };
