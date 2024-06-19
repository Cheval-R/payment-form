const cardDisplay = document.querySelector('.card-display');
const button = document.querySelector('.payment__submit');

const cardDisplayNumber = document.querySelector('.card-display__number');
const cardDisplayName = document.querySelector('.card-display__name');
const cardDisplayDate = document.querySelector('.card-display__date');

const cardNumberInput = document.querySelector('#cardnumber');
const cardMask = new Inputmask('9999 9999 9999 9999', { "placeholder": "**** **** **** ****" });
cardMask.mask(cardNumberInput);

const expiryInput = document.querySelector('#expiry');
const expiryMask = new Inputmask('99/99', { "placeholder": "mm/yy" });
expiryMask.mask(expiryInput);

const cvvInput = document.querySelector('#cvv');
const cvvMask = new Inputmask('999', { "placeholder": "***" });
cvvMask.mask(cvvInput);


const validator = new JustValidate('#form');

validator
	.addField('#cardholder', [
		{
			rule: 'required',
		},
		{
			rule: 'customRegexp',
			value: /^[A-Z][a-z]*\s[A-Z][a-z]*$/,
		},
		// ^[A-Z][a-z]*\s[A-Z][a-z]*$
		{
			validator(value) {
				if (value.length > 0) { cardDisplayName.textContent = value; }
				return value.length > 3;
			},
			errorMessage: 'Minimum 4 characters',
		}
	])
	.addField('#cardnumber', [
		{
			rule: 'required'
		},
		{
			validator(value) {
				const card = cardNumberInput.inputmask.unmaskedvalue();
				if (value.length > 0) { cardDisplayNumber.textContent = value; }
				return !!(Number(card) && card.length === 16);
			},
			errorMessage: 'Please enter a valid card number',
		},
	])
	.addField('#expiry', [
		{
			rule: 'required'
		},
		{
			plugin: JustValidatePluginDate(() => ({
				format: 'mm/yy',
				isAfter: '01/24',
				isBefore: '12/30',
			})),
			errorMessage: 'Incorrect date',
		},
		{
			validator(value) {
				const expiry = expiryInput.inputmask.unmaskedvalue();
				console.log(value);
				if (value.length > 0) {
					cardDisplayDate.textContent = value;
				}
				return !!(Number(expiry) && expiry.length === 4);
			},
		},
	])
	.addField('#cvv', [
		{
			rule: 'integer',
		},
		{
			rule: 'required',
		}
	])
	.onSuccess(event => {
		const target = event.target;
		axios.post('https://jsonplaceholder.typicode.com/posts', {
			cardholder: target.cardholder.value,
			cardnumber: target.cardnumber.value,
			expiry: target.expiry.value,
			cvv: target.cvv.value,
		})
			.then(response => {
				target.reset();
				cardDisplay.style.background = "linear-gradient(233deg, rgba(178, 216, 147, 1) 26%, rgba(163, 239, 179, 1) 70%)";
				button.style.background = "linear-gradient(233deg, rgba(178, 216, 147, 1) 26%, rgba(163, 239, 179, 1) 70%)";
				button.textContent = "SUCCESS";
			})
			.catch(err => {
				button.textContent = "ERROR";
				cardDisplay.style.background = "linear-gradient(233deg, rgba(228,104,104,1) 23%, rgba(234,122,41,1) 52%, rgba(255,29,0,1) 73%)";
				button.style.background = "linear-gradient(233deg, rgba(228,104,104,1) 23%, rgba(234,122,41,1) 52%, rgba(255,29,0,1) 73%)";
			})

	});