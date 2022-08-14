
$(document).ready(function () {


	// Select
	$(document).click(function (event) {
		if ($(event.target).closest(".select").length)
			return;
		$('.select__link').removeClass('active');
		$('.select__arrow').removeClass('active');
		$('.select__link').parent().find('.select__drop').slideUp("fast");
		event.stopPropagation();
	});
	$('.select__arrow').on('click', function () {
		$(this).siblings('.select__link').trigger('click');
	});
	$('.select__link').click(function () {
		/* Заносим выпадающий список в переменную */
		const dropBlock = $(this).parent().find('.select__drop');
		const dateItem = $('.list-of-events__item ');

		//  закрываем все открытые
		$('.select__link').removeClass('active').parent().find('.select__drop').slideUp("fast");
		$('.select__link').siblings('.select__arrow').removeClass('active');

		/* Делаем проверку: Если выпадающий блок скрыт то делаем его видимым*/
		if (dropBlock.is(':hidden')) {
			dropBlock.slideDown();

			/* Выделяем ссылку открывающую select */
			$(this).addClass('active');
			$(this).siblings(".select__arrow").addClass('active');


			/* Работаем с событием клика по элементам выпадающего списка */
			$('.select__drop').find('li').off("click").click(function () {

				/* Заносим в переменную HTML код элемента
				 списка по которому кликнули */
				const selectAllResult = $(this).html();
				const selectText = $(this).find('span').text();

				/* Передаем значение переменной selectAllResult в ссылку которая
				 открывает наш выпадающий список и удаляем активность */
				$(this).parents(".select").find(".select__link").removeClass('active').html(selectAllResult);

				/* Находим наш скрытый инпут и передаем в него
				 значение из переменной selectText */
				$(this).parents(".select").find('input').val(selectText);

				$(".select__arrow").removeClass('active');
				/* проходим по всем блокам с мероприятиями и показываем совпадающий с выбранным в селекте  ,либо показываем все  */
				dateItem.each(function (e) {
					var thisTextLi = $(this).find('.list-of-events__item-title').text();

					if(thisTextLi.indexOf(selectText) >= 0) {
						$(this).parent().show();
					} else if(selectText == 'Показать всё') {
						dateItem.each(function () {
							$(this).parent().show();
						});
					} else {
						$(this).parent().hide();
					}
				});

				/* Скрываем выпадающий блок */
				dropBlock.slideUp();
			});

			/* Продолжаем проверку: Если выпадающий блок не скрыт то скрываем его */
		} else {
			$(this).removeClass('active');
			$(".select__arrow").removeClass('active');
			dropBlock.slideUp();
		}

		/* Предотвращаем обычное поведение ссылки при клике */
		return false;
	});

});
