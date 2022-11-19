import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import { fetchCountries } from './js/fetchCountries';

const searchBox = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const delayRef = 300;

searchBox.addEventListener('input', debounce(onSearch, delayRef));

function onSearch(event) {
  const searchCountry = searchBox.value.trim();

  if (!searchCountry) {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    return;
  }

  fetchCountries(searchCountry)
    .then(data => {
      if (data.length > 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length > 2 && data.length <= 9) {
        countryInfo.innerHTML = '';
        return renderCountryList(data);
      } else countryList.innerHTML = '';
      renderCountryInfo(data);
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops, there is no country with that name',
        error
      );
    });
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
            <p><img src="${country.flags.svg}" alt="country flag ${country.name}" width='35' height='20'></img> <b>Name</b>: ${country.name.official}</p>
          </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
  const markup = country
    .map(country => {
      return `<li>        
            <p style="font-size:24px;"><img src="${
              country.flags.svg
            }" alt="country flag ${
        country.name
      }" width='70' height='40'></img> <b>Name</b>: ${country.name.official}</p>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)}</p>
          </li>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}
