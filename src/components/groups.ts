import iconExit from "../icons/Vector.svg?raw";
import iconBasket from "../icons/basket.svg?raw";
function renderGroups(): string {
  return `
        <aside class="groups">
           <header class="groups__header">
           <h3>Группы контактов</h3>
           <button id="close-groups" class="groups__button_close">
           ${iconExit}
           </button>
           </header>
           <main class="groups__main">
           <div class="group">
           <input id="group-name" type="text" placeholder="Введите название "/>
           <button class="groups__button_delete">${iconBasket}</button>
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
