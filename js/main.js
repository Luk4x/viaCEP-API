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

$('.spinner-border').hide();

$('#cep-in').on('input', () => {
    $('.viaCEP-api-data').empty();
    $('.map').empty();
    $('.catch-data').removeClass('catch-data-active');
    $('.user-input').removeClass('user-input-active');
    $('.user-input').removeClass('invalid');
    $('.user-input').removeClass('not-found');
    $('.result').hide().removeClass('result-active');

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

    $.ajax({
        url: `https://viacep.com.br/ws/${$('#cep-in').val()}/json/`,
        type: 'GET',
        success: cepData => {
            if (!cepData.erro) {
                console.log(cepData);
                // arranging the area for the data
                $('.catch-data').addClass('catch-data-active');
                $('.user-input').addClass('user-input-active');

                // showing cep data
                for (let data in cepData) {
                    if (cepData[data]) {
                        const cepDataParagraph = document.createElement('p');
                        cepDataParagraph.innerHTML = `<strong>${data.toUpperCase()}</strong>: ${cepData[data]}`;
                        $('.viaCEP-api-data').append(cepDataParagraph);
                    }
                }

                const mapData = document.createElement('iframe');
                $(mapData).attr({ id: 'map-iframe', src: `https://maps.google.com/maps?q=${cepData.siafi} ${cepData.localidade}, ${cepData.uf}&t=k&z=15&ie=UTF8&iwloc=&output=embed`, frameBorder: '0', scrolling: 'no', marginHeight: '0', marginWidth: '0' });
                $('.map').append(mapData);

                // show results as user type
                $('.spinner-border').delay(600).hide(0);
                $('.result').show().addClass('result-active');
            } else {
                // show results as user type
                $('.spinner-border').delay(300).hide(0);
                $('.user-input').addClass('not-found'); // error message - api error return (CEP don't exists)
            }
        },
        error: () => {
            if ($('#cep-in').val().length > 8) {
                $('.spinner-border').hide();
                $('.user-input').addClass('invalid'); // error message - api request error (invalid CEP request)
            }
        }
    });
});
