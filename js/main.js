$('#cep-in').focus(() => {
    $('.bx-search').toggleClass('bx-search-active');
});

$('#cep-in').focusout(() => {
    $('.bx-search').toggleClass('bx-search-active');
});

$(() => {
    $('.spinner-border').hide();
});

$('#cep-in').on('input', () => {
    $('.result').hide();

    // show bootstrap spinner
    if ($('#cep-in')[0].value.length !== 0) {
        $(() => {
            $('.spinner-border').show();
        });
    } else {
        $(() => {
            $('.spinner-border').hide();
        });
    }

    $('.catch-data').removeClass('catch-data-active');
    $('.user-input').removeClass('user-input-active');

    $.ajax({
        url: `https://viacep.com.br/ws/${$('#cep-in')[0].value}/json/`,
        type: 'GET',
        success: cepData => {
            $('.result').empty();

            let resultShowTime = 0;
            if (!cepData.erro) {
                // arranging the area for the data
                $('.catch-data').toggleClass('catch-data-active');
                $('.user-input').toggleClass('user-input-active');

                // showing cep data
                for (let data in cepData) {
                    if (cepData[data]) {
                        const cepDataParagraph = document.createElement('p');
                        cepDataParagraph.innerHTML = `<b>${data.toUpperCase()}</b>: ${cepData[data]}`;
                        $('.result').append(cepDataParagraph);
                    }
                }
                resultShowTime = 800;
            } else {
                const errorParagraph = document.createElement('p');
                errorParagraph.innerText = 'Este CEP não foi encontrado.';
                $('.result').append(errorParagraph);
                resultShowTime = 400;
            }

            // show results when user finish type the cep
            setTimeout(() => {
                $('.spinner-border').hide();
                $('.result').show();
            }, resultShowTime);
        },
        error: () => {
            $('.result').empty();

            if ($('#cep-in')[0].value.length > 8) {
                // error message
                const errorParagraph = document.createElement('p');
                errorParagraph.innerText = 'Este CEP é inválido.';
                $('.result').append(errorParagraph);

                setTimeout(() => {
                    $('.result').show();
                }, 200);

                $(() => {
                    $('.spinner-border').hide();
                });
            }
        }
    });
});
