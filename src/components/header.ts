import icon_book from "../icons/contact-book 1 (Traced).png";
function renderHeader(): string {
  return `
        <header class="header">
            <div class="header__container"> 
            <div class="header__contacts">
               <div class="header__icon"><img src="${icon_book}"></div>
               <div class="header__title">
                <h3>Книга контактов</h1>
                </div>
            </div>
            <div class="header__buttons">
                <button id="add-contact" class="header__button__add">Добавить контакт</button>
                <button id="group" class="header__button">Группы</button>
            </div>
            </div>
        </header>
    `;
}

export { renderHeader };
