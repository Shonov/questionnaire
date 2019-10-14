import $ from 'jquery';
import "bootstrap-slider";
import "jquery-validation";

import '../scss/style.scss';
import {url} from '../js/config';

$('.text-field-container--for-radio').on('click', function (e) {
    $('.fields-poll__box--radio').addClass('fields-poll__name-box--unactive');
});

$('.fields-poll__field--left').on('click', function (e) {
    $('.fields-poll__box--radio').removeClass('fields-poll__name-box--unactive');
    $('.text-field-container__field--for-radio').val('');
});

let typeForm;

$('.form-poll').submit(function (e) {
    e.preventDefault();

    let form = $(this);
    let data = form.serialize();
    data += '&type=' + typeForm;

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: data,
        beforeSend: function() {
            form.find('input[type="submit"]').attr('disabled', true);
        },
        complete: function() { // в конце любого исхода
            form.find('input[type="submit"]').prop('disabled', false);
        },
        success: function (msg) {
            console.log('success');
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr,ajaxOptions, thrownError, arguments);
        },
    });
});

function openForm(selector) {
    $('body').css('overflow-y', 'hidden');
    $('.loader').css('display', 'flex').fadeIn();
    $('.choice-poll').hide();

    const delay = t => new Promise(resolve => setTimeout(resolve, t));
    delay(1000).then(() => {
        $(selector).fadeIn(1000);

        if (selector === '.trial-form') {
            $("#ex1").slider({
                ticks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                ticks_labels: ['<br class="pc-hidden">1', '<br class="pc-hidden">2', '<br class="pc-hidden">3', '<br class="pc-hidden">4', '<br class="pc-hidden">5', '<br class="pc-hidden">6', '<br class="pc-hidden">7', '<br class="pc-hidden">8', '<br class="pc-hidden">9', '<br class="pc-hidden">10'],

                formatter() {
                    return null;
                }
            });
        }

        $('body').css('overflow-y', 'auto');
        $('.loader').css('display', 'none').fadeOut();
    });
}
$("#ex1").slider({
    ticks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ticks_labels: ['<br class="pc-hidden">1', '<br class="pc-hidden">2', '<br class="pc-hidden">3', '<br class="pc-hidden">4', '<br class="pc-hidden">5', '<br class="pc-hidden">6', '<br class="pc-hidden">7', '<br class="pc-hidden">8', '<br class="pc-hidden">9', '<br class="pc-hidden">10'],

    formatter() {
        return null;
    }
});

$('.trial').on('click', function() {
    openForm('.trial-form');
    typeForm = 'trial';
});

$('.membership').on('click', function() {
    openForm('.membership-form');
    typeForm = 'membership';
});
