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
    $('.result').hide(800);

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
            $('.viaCEP-api-data').empty();
            $('.map').empty();

            let resultShowTime = 0;
            if (!cepData.erro) {
                console.log(cepData);
                // arranging the area for the data
                $('.catch-data').toggleClass('catch-data-active');
                $('.user-input').toggleClass('user-input-active');

                // showing cep data
                for (let data in cepData) {
                    if (cepData[data]) {
                        const cepDataParagraph = document.createElement('p');
                        cepDataParagraph.innerHTML = `<b>${data.toUpperCase()}</b>: ${cepData[data]}`;
                        $('.viaCEP-api-data').append(cepDataParagraph);
                    }
                }

                const mapData = document.createElement('iframe');
                $(mapData).attr({ id: 'map-iframe', src: `https://maps.google.com/maps?q=${cepData.localidade}&t=k&z=15&ie=UTF8&iwloc=&output=embed`, frameBorder: '0', scrolling: 'no', marginHeight: '0', marginWidth: '0' });
                $('.map').append(mapData);

                resultShowTime = 800;
            } else {
                const errorParagraph = document.createElement('p');
                errorParagraph.innerText = 'Este CEP não foi encontrado.';
                $('.viaCEP-api-data').append(errorParagraph);
                resultShowTime = 400;
            }

            // show results when user finish type the cep
            setTimeout(() => {
                $('.spinner-border').hide();
                $('.result').show(resultShowTime);
            }, resultShowTime);
        },
        error: () => {
            $('.viaCEP-api-data').empty();
            $('.map').empty();

            if ($('#cep-in').val().length > 8) {
                // error message
                const errorParagraph = document.createElement('p');
                errorParagraph.innerText = 'Este CEP é inválido.';
                $('.viaCEP-api-data').append(errorParagraph);

                setTimeout(() => {
                    $('.result').show(400);
                }, 200);

                $(() => {
                    $('.spinner-border').hide(300);
                });
            }
        }
    });
});
