
// функция throttle
function throttle(func, ms) {

	var isThrottled = false,
		savedArgs,
		savedThis;

	function wrapper() {

		if (isThrottled) { // (2)В этом состоянии все новые вызовы запоминаются в замыкании через savedArgs/savedThis. Обратим внимание, что и контекст вызова и аргументы для нас одинаково важны и запоминаются одновременно. Только зная и то и другое, можно воспроизвести вызов правильно.
			savedArgs = arguments;
			savedThis = this;
			return;
		}

		func.apply(this, arguments); // (1)Декоратор throttle возвращает функцию-обёртку wrapper, которая при первом вызове запускает func и переходит в состояние «паузы» (isThrottled = true).

		isThrottled = true;

		setTimeout(function () {
			isThrottled = false; // (3)Далее, когда пройдёт таймаут ms миллисекунд – пауза будет снята, а wrapper – запущен с последними аргументами и контекстом (если во время паузы были вызовы).
			if (savedArgs) {
				wrapper.apply(savedThis, savedArgs);
				savedArgs = savedThis = null;
			}
		}, ms);
	}

	return wrapper;
}

// табы tabs
// для parents в чистом js
// matches это для IE ибо в parents применяется проверка
;(function (e) {
	var matches = e.matches || e.matchesSelector || e.webkitMatchesSelector || e.mozMatchesSelector || e.msMatchesSelector || e.oMatchesSelector;
	!matches ? (e.matches = e.matchesSelector = function matches(selector) {
		var matches = document.querySelectorAll(selector);
		const th = this;
		return Array.prototype.some.call(matches, function (e) {
			return e === th;
		});
	}) : (e.matches = e.matchesSelector = matches);
})(Element.prototype);

Element.prototype.parents = function (selector) {
	let elements = [];
	let elem = this;
	const ishaveselector = selector !== undefined;

	while ((elem = elem.parentElement) !== null) {
		if (elem.nodeType !== Node.ELEMENT_NODE) {
			continue;
		}

		if (!ishaveselector || elem.matches(selector)) {
			elements.push(elem);
		}
	}

	return elements;
};
// Create Element.remove() function if not exist
if (!('remove' in Element.prototype)) {
	Element.prototype.remove = function () {
		if (this.parentNode) {
			this.parentNode.removeChild(this);
		}
	};
}

// Определения браузера
function get_name_browser() {
	// получаем данные userAgent
	const ua = navigator.userAgent;
	// с помощью регулярок проверяем наличие текста,
	// соответствующие тому или иному браузеру
	if (ua.search(/Edge/) > 0) return 'Edge';
	if (ua.search(/Chrome/) > 0) return 'Google Chrome';
	if (ua.search(/Firefox/) > 0) return 'Firefox';
	if (ua.search(/Opera/) > 0) return 'Opera';
	if (ua.search(/Safari/) > 0) return 'Safari';
	if (ua.search(/MSIE/) > 0) return 'Internet Explorer';
	if (ua.search(/Trident/) > 0) return 'Trident';
	// условий может быть и больше.
	// сейчас сделаны проверки только
	// для популярных браузеров
	return 'Не определен';
}


$(document).ready(function () {

	$('.add-event__form').tooltipster({
		trigger: 'none', // чтобы при ховере и клике не вылетало окошко с ошибкой ставим none. Либо hover/click по надобности
		position: 'top',
		timer: 2500,
		theme: ['tooltipster-punk', 'tooltipster-punk-customized'],
		functionPosition: function (instance, helper, position) {
			position.coord.top += 72;
			return position;
		}
	});

	// класс EventObserver
	class EventObserver {
		constructor() {
			this.observers = [];
		}

		subscribe(fn) {
			this.observers.push(fn);
		}

		unsubscribe(fn) {
			this.observers = this.observers.filter(
				subscriber => subscriber !== fn
			)
		}

		broadcast(data) {
			this.observers.forEach(subscriber => {
				subscriber(data);
			});
		}
	}

	class listOfEventsClass {

		constructor() {
			this.start_time = 9;
		}

		// работает с вводом времени
		setTimeStart() {
			$('#add-event-time-start').timepicki({
				start_time: ["12", "00", "AM"],
				min_hour_value: 9,
				max_hour_value: 18,
				show_meridian: false,
			});
		}

		setTimeEnd() {
			$('#add-event-time-end').timepicki({
				start_time: ["12", "00", "AM"],
				min_hour_value: this.start_time,
				max_hour_value: 18,
				show_meridian: false,
			});
		}

		// обещание, что дата добавилась в массив arrDateVal
		promiseDateVal() {

			return new Promise((resolve, reject) => {

				resolve();
			});
		}

		// Основная функция по мероприятиям
		listOfEvents() {
			// создаём новый обсёрвер
			const formObserver = new EventObserver();
			// переменные полей формы и кнопка
			const inputName = document.querySelector('#add-event-name'),
					inputDate = document.querySelector('#add-event-date'),
					inputTimeStart = document.querySelector('#add-event-time-start'),
					inputTimeEnd = document.querySelector('#add-event-time-end'),
					formSubmit = document.querySelector('.add-event__form-submit button'),
					eventsItems = document.querySelector('.list-of-events__items'),
					arrSelectLi = [].slice.call(document.querySelectorAll('.list-of-events__select-wrap .select .select__drop li')),
					arrDateVal = [];
			let uniqArrDateVal = [],
				arrayAllEvents = [];
			var idForArrayAllEvents = 0,
				self = this;


			// уведомляем (broadcast) подписчиков о клике
			formSubmit.addEventListener('click', () => {

				formObserver.broadcast(function () {
					const inputNameVal = inputName.value;
					const inputDateVal = inputDate.value;
					const inputTimeStartVal = inputTimeStart.value;
					const inputTimeEndVal = inputTimeEnd.value;
					let objValues = {};

					objValues = {
						name: inputNameVal,
						date: inputDateVal,
						timeStart: inputTimeStartVal,
						timeEnd: inputTimeEndVal,
						id: idForArrayAllEvents++
					};

					return objValues;
				});

				arrSelectLi.forEach((item, i) => {
					let valSpan = item.querySelector('span').textContent;

					if (item.querySelector('span').textContent === 'нет мероприятий') {
						delete arrDateVal[i];
					} else {
						arrDateVal.push(valSpan);
						this.promiseDateVal();
					}
				});


			});
			// подписываемся на клик в submit формы, на создание массива всех мероприятий
			formObserver.subscribe(obj => {
				// если получаем date то вкладываем в ассоциативный массив мероприятия
				if (obj().date && obj().timeStart && obj().timeEnd) {
					if (arrayAllEvents.length > 0) {
						this.promiseDateVal().then(result => {
							const thisDate = arrayAllEvents.filter(event => parseInt(event.date) === parseInt(obj().date));
							// проверка на пересечение мероприятий один на другой
							console.log('thisDate', thisDate);
							console.log('obj', obj());
							console.log('obj time', obj().date + ' ' + obj().timeStart);

							let some = thisDate.some(item => {
								console.log('!!some!! item', item.date + ' ' + item.timeStart)
								console.log('!!some!!', moment('2022-08-15 12:00').isSame('2022-08-15 12:00'));

								 return moment(obj().date + ' ' + obj().timeStart).isSame(item.date + ' ' + item.timeStart) || moment(obj().date + ' ' + obj().timeStart).isBetween(item.date + ' ' + item.timeStart, item.date + ' ' + item.timeEnd) || moment(obj().date + ' ' + obj().timeEnd).isSame(item.date + ' ' + item.timeEnd) || moment(obj().date + ' ' + obj().timeEnd).isBetween(item.date + ' ' + item.timeStart, item.date + ' ' + item.timeEnd) || moment(item.date + ' ' + item.timeEnd).isBetween(obj().date + ' ' + obj().timeStart, obj().date + ' ' + obj().timeEnd, null, '(]') || moment(item.date + ' ' + item.timeStart).isBetween(obj().date + ' ' + obj().timeStart, obj().date + ' ' + obj().timeEnd)
								//return new Date(item.date + ' ' + item.timeEnd).getTime() > new Date(obj().date + ' ' + obj().timeStart).getTime() && new Date(item.date + ' ' + item.timeEnd).getTime() <= new Date(obj().date + ' ' + obj().timeEnd).getTime()
							});

							console.log('пересечение мероприятий ' + some);

							if (some) {
								$('.add-event__form').tooltipster('content', "Время зарезервировано под другое мероприятие");
								$('.add-event__form').tooltipster('show');
							} else {
								arrayAllEvents.push(obj());
							}
						});
					} else if (arrayAllEvents.length === 0) {
						arrayAllEvents.push(obj());
					}
				} else {
					$('.add-event__form').tooltipster('content', "Введите число и все даты");
					$('.add-event__form').tooltipster('show');
				}
			});
			// Функуция создания Li шек в селекте с датами
			const createli = obj => {
				const selectUL = document.querySelector('.list-of-events__select-wrap .select .select__drop');

				const selectTpl = text => {
					return `
						<span>${text}</span>
					`;
				};

				// если получаем date то создаём li шки в селекте
				if (obj().date && obj().timeStart && obj().timeEnd) {
					let li = document.createElement('li');
					li.innerHTML = selectTpl(obj().date);
					if (arrSelectLi.length > 1) {
						arrSelectLi.forEach(item => {
							if (item.querySelector('span').textContent !== 'нет мероприятий') {
								if (parseInt(item.querySelector('span').textContent) !== parseInt(obj().date)) {
									arrSelectLi.push(li);

								}
							}
						});
					} else {
						arrSelectLi.push(li);
					}
					this.promiseDateVal().then(result => {
						const addedLiDOM = [].slice.call(document.querySelectorAll('.select .select__drop li'));
						const addedLiDOMVal = [];
						addedLiDOM.forEach(item => {
							let title = item.querySelector('span').textContent;
							addedLiDOMVal.push(title);
						});
						arrSelectLi.forEach((item, i) => {

							if (item.querySelector('span').textContent === 'нет мероприятий') {
								item.querySelector('span').textContent = 'Показать всё';
							} else if (addedLiDOMVal.indexOf(item.querySelector('span').textContent) >= 0) {
								return false;
							}  else {
								selectUL.appendChild(item);
							}

						});
					});
				} else {
					$('.add-event__form').tooltipster('content', "Введите число и все даты");
					$('.add-event__form').tooltipster('show');
				}
			};
			// подписываем селект  на новые данные из формы (formObserver) на клик
			formObserver.subscribe(createli);

			// функция создания элементов list-of-events__item
			const createDate = obj => {
				// создаём шаблон-основу для последующего использования ниже
				const eventTpl = text => {
					return `
								<div class="list-of-events__item">
									<div class="list-of-events__item-title">${text}</div>
									<div class="list-of-events__item-table">
										<table>
											  <tbody>
											  </tbody>
										</table>
									</div>
								</div>
							`;
				};
				// создаём шаблон tr для того чтобы потом вложить в eventTpl в body
				const trTpl = (title, startTime, endTime, date, id) => {
					return `
								<td data-id="${id}" class="hidden"></td>
								 <td>${title}</td>
								 <td class="hidden-date">
										${date}
								</td>
								<td>${startTime}</td>
								<td>${endTime}</td>
								<td><a href="#"><i><svg class="svg-inline--fa fa-edit fa-w-18" aria-hidden="true" data-prefix="fas" data-icon="edit" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path></svg><!-- <i class="fas fa-edit"></i> --></i></a></td>
								<td><a href="#" class="deleteEvent"><i><svg class="svg-inline--fa fa-times fa-w-11" aria-hidden="true" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" data-fa-i2svg=""><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg><!-- <i class="fas fa-times"></i> --></i></a>
								</td>
							`;
				};
				if (obj().date && obj().timeStart && obj().timeEnd) {
					let div = document.createElement('div');

					uniqArrDateVal.push(obj().date);

					div.classList.add('col-12', 'col-lg-4', 'col-md-6');
					// если получаем промис по изменению массива с датами создаём список дат
					this.promiseDateVal().then(result => {
						const addedEventsDOM = [].slice.call(document.querySelectorAll('.list-of-events__item'));
						const addedEventsDOMTitleVal = [];
						addedEventsDOM.forEach(item => {
							let title = item.querySelector('.list-of-events__item-title').textContent;
							addedEventsDOMTitleVal.push(title);
						});
						// дождались обещания от promiseDateVal и работаем с уникальными значениями даты
						uniqArrDateVal.forEach((item, i, array) => {
							// сверяем на похожие даты
							if (addedEventsDOMTitleVal.indexOf(item) >= 0) {

								return false;
							} else {
								div.innerHTML = eventTpl(item);
								eventsItems.appendChild(div);
							}
						});
						// после создания дат мероприятий берём обновлённый DOM этих элементов и вносим туда мероприятия
						const addedEventsDOMUp = [].slice.call(document.querySelectorAll('.list-of-events__item'));
						const addedEventsDOMTitleValUp = [];
						addedEventsDOMUp.forEach(item => {
							let title = item.querySelector('.list-of-events__item-title').textContent;
							addedEventsDOMTitleValUp.push(title);
						});
						addedEventsDOMUp.forEach((item, i, array) => {

							// заходим в нужную дату
							if (item.querySelector('.list-of-events__item-title').textContent.indexOf(obj().date) >= 0) {

								const thisDateEvents = [].slice.call(item.querySelectorAll('table tbody tr'));

								console.log('заходим в нужную дату arrayAllEvents', arrayAllEvents)

								const thisDate = arrayAllEvents.filter(event => event.date === obj().date);

								console.log('заходим в нужную дату thisDate', thisDate)

								thisDate.forEach((itemEvents) => {
									let tr = document.createElement('tr');

									tr.innerHTML = trTpl(itemEvents.name, itemEvents.timeStart, itemEvents.timeEnd, itemEvents.date, itemEvents.id);

									if(item.querySelector('table tbody tr')) {
										const result = thisDateEvents.some(thisDateEvent =>
											{
												return parseInt(thisDateEvent.querySelector('td.hidden').getAttribute('data-id')) === parseInt(itemEvents.id);
											});

										if(result) {
											return;
										} else {
											item.querySelector('table tbody').appendChild(tr);
										}

									} else {
										console.log('нет TR');

										item.querySelector('table tbody').appendChild(tr);
									}

								});
							} else {
								return false;
							}
						});
					});
				} else {
					$('.add-event__form').tooltipster('content', "Введите число и все даты");
					$('.add-event__form').tooltipster('show');
				}
			};
			// подписываемся на данные из формы для создания дат мероприятий и самих мероприятий
			formObserver.subscribe(createDate);
			// события ввода времени time-start
			inputTimeStart.addEventListener('focus', () => {
				inputTimeEnd.value = '';
			});
			inputTimeStart.parents('.add-event__input-item')[0].addEventListener('change', ({target} = event) => {
				const that = this;
				if (target.parentNode.classList.contains('ti_tx')) {
					if (target.classList.contains('timepicki-input')) {
						// устанавливаем по выбранному стартовому времени лимит time-end
						if (parseInt(target.value) < 9) {
							this.start_time = 9;
						} else {
							this.start_time = target.value;
						}
						setTimeout(function () {
							// делаем destroy плагину timepicki (такой уж костыль ...)
							$('#add-event-time-end')
								.off('blur focus')
								.removeData()
								.removeAttr('data-timepicki-tim data-timepicki-mini data-timepicki-meri');
							$('#add-event-time-end').next('.timepicker_wrap').remove();
							$('#add-event-time-end').unwrap();
							$('#add-event-time-end').val('');
							that.setTimeEnd();
						}, 300);
					}
				}
			});
			inputTimeStart.parents('.add-event__input-item')[0].addEventListener('click', ({target} = event) => {
				const that = this;
				if (target.parentNode.classList.contains('time')) {
					if (target.classList.contains('action-next')) {
						// устанавливаем по выбранному стартовому времени лимит time-end

						let [valHours] = inputTimeStart.value.split(/\s*:\s*/);

						this.start_time = parseInt(valHours) + 1;
						// делаем destroy плагину timepicki (такой уж костыль ...)
						$('#add-event-time-end')
							.off('blur focus')
							.removeData()
							.removeAttr('data-timepicki-tim data-timepicki-mini data-timepicki-meri');
						$('#add-event-time-end').next('.timepicker_wrap').remove();
						$('#add-event-time-end').unwrap();
						$('#add-event-time-end').val('');
						that.setTimeEnd();
					} else if (target.classList.contains('action-prev')) {
						// устанавливаем по выбранному стартовому времени лимит time-end

						let [valHours] = inputTimeStart.value.split(/\s*:\s*/);

						this.start_time = parseInt(valHours) - 1;

						// делаем destroy плагину timepicki (такой уж костыль ...)
						$('#add-event-time-end')
							.off('blur focus')
							.removeData()
							.removeAttr('data-timepicki-tim data-timepicki-mini data-timepicki-meri');
						$('#add-event-time-end').next('.timepicker_wrap').remove();
						$('#add-event-time-end').unwrap();
						$('#add-event-time-end').val('');
						that.setTimeEnd();
					}
				}
			});
			// конец событий ввода времени
			// клик на крестик (удалить мероприятие в дате)
			eventsItems.addEventListener('click', function ({target} = event) {

				// делигируем событие click на ссылку с классом deleteEvent
				if(target.classList.contains('deleteEvent')) {
					event.preventDefault();
					let targetId = target.parents('tr')[0].querySelector('td.hidden').getAttribute('data-id');
					let targetDate = target.parents('.list-of-events__item')[0].querySelector('.list-of-events__item-title').textContent;
					//удаляем всю дату list-of-events__item еси это последняя tr
					if(target.parents('table')[0].querySelectorAll('tr').length === 1) {

						target.parents('.list-of-events__item')[0].parentNode.remove();

						// удаляем из массива дат дату, которую удалили выше
						uniqArrDateVal.forEach(item => {
							if (parseInt(item) === parseInt(targetDate)) {
								uniqArrDateVal.splice(uniqArrDateVal.indexOf(item), 1);
							}
						});

						// удаляем лишку с датой, которую удаляем, из селекта (и в массиве лишек тоже удаляем)
						// удаляем с помощью мутации массива arrSelectLi с использованием reverse()
						arrSelectLi.slice().reverse().forEach(function(item, index, object) {
							if (parseInt(item.querySelector('span').textContent) === parseInt(targetDate)) {
								arrSelectLi.splice(object.length - 1 - index, 1);
								item.remove();
							}
						});

					}

					target.parents('tr')[0].remove();

					arrayAllEvents.forEach((item, i) => {

						if (parseInt(item.id) === parseInt(targetId)) {
							arrayAllEvents.splice(arrayAllEvents.indexOf(item), 1);
						}

					});

				}
			});

		}
	}

	const listOfEventsClassNew = new listOfEventsClass();
	listOfEventsClassNew.listOfEvents();
	listOfEventsClassNew.setTimeStart();
	listOfEventsClassNew.setTimeEnd();

	// Инициализация datepicker
	$(".datepicker").datepicker({
		showOtherMonths: true,
		changeMonth: true,
		changeYear: true,
		dateFormat: "yy-mm-dd",
		monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
		dayNamesMin: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
		firstDay: 1,
		beforeShow: function (input, inst) {
			// Handle calendar position before showing it.
			// It's not supported by Datepicker itself (for now) so we need to use its internal variables.
			var calendar = inst.dpDiv;

			// Dirty hack, but we can't do anything without it (for now, in jQuery UI 1.8.20)
			setTimeout(function () {
				calendar.position({
					my: 'center top',
					at: 'center bottom',
					collision: 'none',
					of: input
				});
			}, 1);
		}
	});

	// // вводим только цифры
	// $("input.only-num").on('keydown', function ({keyCode, ctrlKey} = e) {
	//
	// 	// Разрешаем нажатие клавиш backspace, Del, Tab и Esc
	// 	if (keyCode == 46 || keyCode == 8 || keyCode == 9 || keyCode == 27 ||
	// 		// Разрешаем выделение: Ctrl+A
	// 		(keyCode == 65 && ctrlKey === true) ||
	// 		// Разрешаем клавиши навигации: Home, End, Left, Right
	// 		(keyCode >= 35 && keyCode <= 39)) {
	// 		return;
	// 	}
	// 	else {
	// 		// Запрещаем всё, кроме клавиш цифр на основной клавиатуре, а также Num-клавиатуре
	// 		if ((keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105)) {
	// 			event.preventDefault();
	// 		}
	// 	}
	// });
	// при клике делаем некликбельным
	$('label.click-disabled').on('click', function () {
		var self = $(this);
		setTimeout(function () {
			self.find('input').attr('disabled', true);
		}, 50);
	});


	// инициализация select2
	$(".select2").select2({
		//minimumResultsForSearch: -1, // выключам поле ввода поиска
		tags: false,
		placeholder: "Выберите язык",
		width: '100%'
	});
	$(".select2-tags").select2({
		tags: true,
		placeholder: "Выберите один или несколько тегов",
		width: '100%'
	});

	if (get_name_browser() == "Trident" || get_name_browser() == "Internet Explorer" || get_name_browser() == "Firefox") {
		// $(".from_what_is_seo .from_what_is_seo_bot_decor svg").css("bottom", "-217px");
		// $(".website_promotion .website_promotion_decor").css("bottom", "-177px");
		// $(".cost_of_online_store .cost_of_online_store_links_item").css("margin-right", "72px");
	}

	if (get_name_browser() == "Trident" || get_name_browser() == "Internet Explorer" || get_name_browser() == "Edge") {
		$('.check i, .radio i').css("margin-top", "2px")
	}
	if (get_name_browser() == "Google Chrome") {
		//console.log("Google Chrome");

	}
	if (get_name_browser() == "Safari") {
		//console.log("Safari");
		// heightItemSafari({
		// 	itemHeight: '.info-blocks__item-txt-block',
		// 	item:  '.info-blocks__btn'
		// });
	}

});

$(window).on('resize', throttle(function () {
	// здесь затормаживаем функции
}, 150));

$(window).resize(function () {

});

$(window).scroll(function () {

});