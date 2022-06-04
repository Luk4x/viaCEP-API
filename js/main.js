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
    console.log($('#cep-in')[0].value.length);
    if ($('#cep-in')[0].value.length !== 0) {
        $(() => {
            $('.spinner-border').show();
        });
    } else {
        $(() => {
            $('.spinner-border').hide();
        });
    }

    $.ajax({
        url: `https://viacep.com.br/ws/${$('#cep-in')[0].value}/json/`,
        type: 'GET',
        success: cepData => {
            $('.result').empty();
            $(() => {
                $('.spinner-border').hide();
            });

            console.log(cepData);
            if (!cepData.erro) {
                for (let data in cepData) {
                    if (cepData[data]) {
                        const cepDataParagraph = document.createElement('p');
                        cepDataParagraph.innerText = `${data.toUpperCase()}: ${cepData[data]}`;
                        $('.result').append(cepDataParagraph);
                    }
                }
            } else {
                const errorParagraph = document.createElement('p');
                errorParagraph.innerText = 'Este CEP não foi encontrado.';
                $('.result').append(errorParagraph);
            }

            // show results when user finish type the cep
            $(() => {
                $('.result').show();
            });
        },
        error: () => {
            $('.result').empty();

            if ($('#cep-in')[0].value.length > 8) {
                // error message
                const errorParagraph = document.createElement('p');
                errorParagraph.innerText = 'Este CEP é inválido.';
                $('.result').append(errorParagraph);

                $(() => {
                    $('.spinner-border').hide();
                });
            } else {
                // hide results while user is typing
                $(() => {
                    $('.result').hide();
                });
            }
        }
    });
});
