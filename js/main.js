$(document.documentElement).keypress(keyP => {
    if (keyP.key == ';' || keyP.key === '/') {
        $('#cep-in').focus();
    }
});

$('#cep-in').focus(() => {
    $('.bx-search').toggleClass('bx-search-active');
});

$('#cep-in').focusout(() => {
    $('.bx-search').toggleClass('bx-search-active');
});

$(() => {
    $('.spinner-border').hide();
});

$('.result').hide();

$('#cep-in').on('input', () => {
    $('.result').hide(300);

    // show bootstrap spinner
    if ($('#cep-in').val().length !== 0) {
        $(() => {
            $('.spinner-border').show(300);
        });
    } else {
        $(() => {
            $('.spinner-border').hide(300);
        });
    }

    $('.catch-data').removeClass('catch-data-active');
    $('.user-input').removeClass('user-input-active');

    $.ajax({
        url: `https://viacep.com.br/ws/${$('#cep-in').val()}/json/`,
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
                $('.result').show(300);
            }, resultShowTime);
        },
        error: () => {
            $('.result').empty();

            if ($('#cep-in').val().length > 8) {
                // error message
                const errorParagraph = document.createElement('p');
                errorParagraph.innerText = 'Este CEP é inválido.';
                $('.result').append(errorParagraph);

                setTimeout(() => {
                    $('.result').show(300);
                }, 200);

                $(() => {
                    $('.spinner-border').hide(300);
                });
            }
        }
    });
});
