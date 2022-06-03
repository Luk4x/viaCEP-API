const cepIn = document.getElementById('cep-in');
const secResult = document.querySelector('.result');

cepIn.addEventListener('input', () => {
    $.ajax({
        url: `https://viacep.com.br/ws/${cepIn.value}/json/`,
        type: 'GET',
        success: cepData => {
            $('.result').empty();

            console.log(cepData);
            if (!cepData.erro) {
                for (let data in cepData) {
                    if (cepData[data]) {
                        const cepDataParagraph = document.createElement('p');
                        cepDataParagraph.innerText = `${data.toUpperCase()}: ${cepData[data]}`;
                        secResult.appendChild(cepDataParagraph);
                    }
                }
            }

            // show results when user finish type the cep
            $(() => {
                $('.result').show();
            });
        },
        error: error => {
            console.log(error);

            $('.result').empty();

            if (cepIn.value.length >= 8) {
                // error message
                const errorParagraph = document.createElement('p');
                errorParagraph.innerText = 'Este CEP não existe.';
                secResult.appendChild(errorParagraph);
            } else {
                // hide results while user is typing
                $(() => {
                    $('.result').hide();
                });
            }
        }
    });
});
