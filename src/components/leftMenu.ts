import iconExit from "../icons/Vector.svg?raw";
function renderLeftMenu(): string {
  return `
        <aside class="left-menu-add">
           <header class="left-menu-add__header">
           <h3>Добавление контакта</h3>
           <button id="close-menu" class="left-menu-add__button">
           ${iconExit}
           </button>
           </header>
           <main class="left-menu-add__main">
           <input type="text" placeholder="Введите ФИО"/>
           <input type="number" placeholder="Введите Введите номер"/>
           <select placeholder="Выберите группу"> 
           <option>Выберите группу</option>
           </select>
           </main>
           <footer class="left-menu-add__footer">
           <button class="left-menu-add__button_save">Сохранить</button>
           </footer>
        </aside>
    `;
}

export { renderLeftMenu };
