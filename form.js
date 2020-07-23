// validation rules
const nameCheck = name => {
  let value = /^[a-zA-Z]+$/;
  return value.test(name);
};

const surnameCheck = surname => {
  let value = /^[a-zA-Z]+$/;
  return value.test(surname);
};

const validatePhone = phone => {
  const isphone = /^[0-9]{9}$/g;
  return isphone.test(phone);
};

const adressCheck = adress => {
  let street = /^[a-zA-Z]*[\s/a-zA-Z]+[\s/0-9]+$/;
  return street.test(adress);
};

const validatePost = postal_code => {
  let post = /^\d{5}$|^\d{2}-\d{3}$/;
  return post.test(postal_code);
};

const cityCheck = city => {
  let value = /^[a-zA-Z]+$/;
  return value.test(city);
};

const isEmail = email => {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
};

//error messages, which will be injected to error fields

const errorMessages = {
  requiredField: 'To pole jest wymagane',
  name: 'Wprowadź poprawne imię',
  surname: 'Wprowadź poprawne nazwisko',
  phone: 'Wpropwadź poprawnie numer telefonu',
  adress: 'Wprowadź poprawnie adres',
  postalCode: 'Wprowadź poprawnie kod pocztowy',
  city: 'Wprowadź poprawnie miejscowość',
  email: 'Wprowadź poprawne email',
};

const validationRules = {
  name: currentInput =>
    nameCheck(currentInput.value.trim()) ? false : errorMessages.name,
  telephone_number: currentInput =>
    validatePhone(currentInput.value.trim()) ? false : errorMessages.phone,
  surname: currentInput =>
    surnameCheck(currentInput.value.trim()) ? false : errorMessages.surname,
  adress: currentInput =>
    adressCheck(currentInput.value.trim()) ? false : errorMessages.adress,
  postalCode: currentInput =>
    validatePost(currentInput.value.trim()) ? false : errorMessages.postalCode,
  city: currentInput =>
    cityCheck(currentInput.value.trim()) ? false : errorMessages.city,
  email: currentInput =>
    isEmail(currentInput.value.trim()) ? false : errorMessages.email,
};

const applyErrorMessage = (item, errorMessage) => {
  item.classList.add('errorInput');
  const errorField = document.createElement('p');
  errorField.classList.add('errorField');
  errorField.innerText = errorMessage;
  item.after(errorField);
};

const removeCurrentErrors = currentInput => {
  let errorField = null;
  const children = currentInput.parentNode.childNodes;
  for (var i = 0; i < children.length; i++) {
    // children[i].nodeType === 1 checks if iterated element has type of `element node`, so we can check it's classList
    if (
      children[i].nodeType === 1 &&
      children[i].classList.contains('errorField')
    ) {
      errorField = children[i];
      break;
    }
  }

  if (errorField) {
    errorField.parentNode.removeChild(errorField);
    currentInput.classList.remove('errorInput');
  }
};

const applyErrorDependingOnValue = (currentInput, errorValue) => {
  const isRequired = currentInput.hasAttribute('required');
  if (!isRequired && !currentInput.value) {
    return;
  }
  if (isRequired && !currentInput.value) {
    applyErrorMessage(currentInput, errorMessages.requiredField);
    return;
  }
  if (errorValue) {
    applyErrorMessage(currentInput, errorValue);
    return;
  }
};

const validationEngine = validationTrigger => {
  const inputsNodeList = validationTrigger
    .closest('form')
    .querySelectorAll('[data-validation_type]');
  const inputsArray = Array.from(inputsNodeList);

  inputsArray.forEach(currentInput => {
    let errorValue = null;
    if (currentInput.getAttribute('data-validation_type') === 'phone_number') {
      errorValue = validationRules.telephone_number(currentInput);
    }
    if (currentInput.getAttribute('data-validation_type') === 'username') {
      errorValue = validationRules.name(currentInput);
    }
    if (currentInput.getAttribute('data-validation_type') === 'surname') {
      errorValue = validationRules.surname(currentInput);
    }
    if (currentInput.getAttribute('data-validation_type') === 'adress') {
      errorValue = validationRules.adress(currentInput);
    }
    if (currentInput.getAttribute('data-validation_type') === 'postal_number') {
      errorValue = validationRules.postalCode(currentInput);
    }
    if (currentInput.getAttribute('data-validation_type') === 'city') {
      errorValue = validationRules.city(currentInput);
    }
    if (currentInput.getAttribute('data-validation_type') === 'email') {
      errorValue = validationRules.email(currentInput);
    }
    removeCurrentErrors(currentInput);
    applyErrorDependingOnValue(currentInput, errorValue);
  });
};

const getInputValue = validationTrigger => {
  const inputsNodeList = validationTrigger
    .closest('form')
    .querySelectorAll('[data-validation_type]');
  const inputsArray = Array.from(inputsNodeList);
  let dataForm = {};
  inputsArray.forEach(input => {
    if (input.hasAttribute('required')) {
      const key = input.getAttribute('data-validation_type');
      const value = input.value.trim();
      dataForm[key] = value;
    }
  });
  return dataForm;
};

const form = document.querySelector('#myForm');

document.addEventListener('click', e => {
  document
    .querySelectorAll('.submit-form_button--clicked')
    .forEach(btn => btn.classList.remove('submit-form_button--clicked'));
  if (
    e.target.tagName === 'BUTTON' &&
    e.target.classList.contains('submit-form_button')
  ) {
    validationEngine(e.target);
    if (
      [...e.target.closest('form').querySelectorAll('.errorField')].length === 0
    ) {
      e.target.classList.add('submit-form_button--clicked');
      const dataForm = getInputValue(e.target);
      sendData(dataForm, 'https://jsonplaceholder.typicode.com/posts');
      form.reset();
    }
    e.preventDefault();
  }
});

const sendData = (data, url) => {
  fetch(url, {
    method: 'POST', // or 'PUT'
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json', // tells the API if the data you sent is JSON or a query string
    },
    body: JSON.stringify(data), //  the data
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
};
// (async () => {
//   const rawResponse = await fetch('https://httpbin.org/post', {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ a: 1, b: 'Textual content' }),
//   });
//   const content = await rawResponse.json();

//   console.log(content);
// })();
