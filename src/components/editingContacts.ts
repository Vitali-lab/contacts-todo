function renderEditingContacts(): string {
  return `
        <section class="editing-contacts">
         <div class="editing-contacts__container">
         <div class="editing-contacts__main__text">
         <h3>Редактирование контакта</h3>
         </div>
         <div class="editing-contacts__inputs">
         <input id="edit-contact-name" type="text" placeholder="Введите ФИО"/>
         <input id="edit-contact-number" type="tel" placeholder="Введите Введите номер"/>
         </div>
         <div class="editing-contacts__buttons">
         <button id="save-contact" class="editing-contacts__button_save">Сохранить</button>
         <button class="editing-contacts__button_cancel">Отмена</button>
         </div>
        </section>
    `;
}

export { renderEditingContacts };
