import Swal from 'sweetalert2';
import './style.css';

const exURL = 'https://api.exchangerate.host/latest?';
const searchButton = document.querySelector('#search');
const mainDiv = document.querySelector('.currencys-exchange');
const currencyText = document.querySelector('.results p');
let localCurrency = document.querySelector('#currency');
let localQuantity = document.querySelector('#value');
const paragraph = document.querySelector('.results p');

const loadCurrency = () => new Promise((resolve, reject) => {
  fetch(`${exURL}base=${localCurrency.value}&amount=${localQuantity.value}&places=3`)
    .then((response) => response.json())
    .then((data) => {
      if (localCurrency.value.replace(/\s/g, '') === '') reject(new Error('Você precisa passar uma moeda'));
      if (localQuantity.value.replace(/\s/g, '') === '') reject(new Error('Você precisa passar uma quantidade'));
      if (data.base !== localCurrency.value.toUpperCase()) reject(new Error('Moeda não existente'));
      resolve(data);
    });
});

const generateCurrency = (currency, value) => {
  for (let index = 0; index < currency.length; index += 1) {
    const divCurrency = document.createElement('div');
    const valueText = document.createElement('p');
    const divText = document.createElement('p');
    divCurrency.classList.add('money');
    divText.innerHTML = `<span class="material-symbols-outlined coin-icon">
    monetization_on
    </span>${currency[index]}`;
    valueText.innerHTML = `${value[index]}`;
    divCurrency.appendChild(divText);
    divCurrency.appendChild(valueText);
    mainDiv.appendChild(divCurrency);
  }
};

const removeSearchedCurrencys = () => {
  while (mainDiv.firstChild) {
    mainDiv.removeChild(mainDiv.firstChild);
  }
};

const callError = (message) => {
  paragraph.style.visibility = 'hidden';
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    background: 'rgba(0, 0, 0, 0.1)',
    color: 'white',
  });
};

const searchCurrency = (event) => {
  event.preventDefault();
  removeSearchedCurrencys();
  loadCurrency()
    .then((response) => {
      localCurrency = document.querySelector('#currency');
      localQuantity = document.querySelector('#value');
      const currency = Object.keys(response.rates);
      const value = Object.values(response.rates);
      paragraph.style.visibility = 'visible';
      currencyText.innerText = `Valores referentes a ${localQuantity.value} ${localCurrency.value.toUpperCase()}`;
      generateCurrency(currency, value);
    })
    .catch((error) => {
      callError(error.message);
    });
};

searchButton.addEventListener('click', searchCurrency);
