const cepIn = document.getElementById('cep-in');
const secResult = document.querySelector('.result');

const requestCEP = async () => {
    try {
        const cepData = await fetch(`https://viacep.com.br/ws/${cepIn.value}/json/`).then(res => res.json());
        console.log(cepData);

        const displayCEPData = document.createElement('p');
        displayCEPData.innerText = Object.entries(cepData);
        console.log(displayCEPData);
        
        secResult.appendChild(displayCEPData);
    } catch (err) {
        console.log(`Error: ${err}`);
    }
};

cepIn.addEventListener('input', requestCEP);
