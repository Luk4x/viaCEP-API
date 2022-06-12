// scale input according to device view width
const viewWidthScaled = (1.4 / 400) * Math.min(window.innerWidth, window.innerHeight);
const viewWidthUnscaled = (1 / 400) * Math.min(window.innerWidth, window.innerHeight);

document.documentElement.style.setProperty('--vw-scale', viewWidthScaled);
document.documentElement.style.setProperty('--vw-unScale', viewWidthUnscaled);

$(window).resize(() => {
    document.documentElement.style.setProperty('--vw-scale', viewWidthScaled);
    document.documentElement.style.setProperty('--vw-unScale', viewWidthUnscaled);
});

// input focus keys (; and /)
$(document).keypress(keyP => {
    if (keyP.key == ';' || keyP.key === '/') {
        $('#cep-in').focus();
    }
});

// focus in/out animation
$('#cep-in').focus(() => {
    $('.bx-search').toggleClass('bx-search-active');
});
$('#cep-in').focusout(() => {
    $('.bx-search').toggleClass('bx-search-active');
});

// hindering spinner on load
$('.spinner-border').hide();

// masking input
$('#cep-in').mask('00000-000');

$('#cep-in').on('input change', () => {
    // general things to reset on user input
    $('.viaCEP-api-data').empty();
    $('.map').empty();
    $('.catch-data').removeClass('catch-data-active');
    $('.user-input').removeClass('user-input-active');
    $('.user-input').removeClass('not-found');
    $('.result').hide().removeClass('result-active');

    // show bootstrap spinner while user is typing
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
                // arranging the result area for the CEP data
                $('.catch-data').addClass('catch-data-active');
                $('.user-input').addClass('user-input-active');

                // inserting cep data on html
                for (let data in cepData) {
                    if (cepData[data]) {
                        const cepDataParagraph = document.createElement('p');
                        cepDataParagraph.innerHTML = `<strong>${data.toUpperCase()}</strong>: ${cepData[data]}`;
                        $('.viaCEP-api-data').append(cepDataParagraph);
                    }
                }

                // inserting map iframe based on CEP data on html
                const mapData = document.createElement('iframe');
                $(mapData).attr({ id: 'map-iframe', src: `https://maps.google.com/maps?q=${cepData.siafi} ${cepData.localidade}, ${cepData.uf}&t=k&z=15&ie=UTF8&iwloc=&output=embed`, frameBorder: '0', scrolling: 'no', marginHeight: '0', marginWidth: '0' });
                $('.map').append(mapData);

                // getting cep data amount
                const cepDataAmount = Object.values(cepData).filter(data => {
                    return data !== '';
                }, []);

                // showing results
                // change font-size based on cep data amount
                if (cepDataAmount.length > 7 && $(document).width() > 1000) $('.viaCEP-api-data').css('font-size', '1.7vw');
                $('.spinner-border').delay(600).hide(0);
                $('.result').show().addClass('result-active');
            } else {
                // showing results
                $('.spinner-border').delay(300).hide(0);
                $('.user-input').addClass('not-found'); // error message - api error return (CEP don't exists)
            }
        },
        error: errorMessage => {
            console.error(errorMessage);
        }
    });
});
