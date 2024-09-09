// аккордеон
let acc = document.getElementsByClassName('answers__accordion-btn');
let i;

for (i = 0; i < acc.length; i++) {
	acc[i].addEventListener('click', function () {
		this.classList.toggle('active');
		var panel = this.nextElementSibling;
		if (panel.style.display === 'block') {
			panel.style.display = 'none';
		} else {
			panel.style.display = 'block';
		}
	});
}
//валидация номера
let inputs = document.querySelectorAll('input[type="tel"]');
let im = new Inputmask("+7 (999) 999-99-99");
im.mask(inputs);

const swiper = new Swiper('.swiper', {
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
	},
	spaceBetween: 10,
	slidesPerView: 2
});