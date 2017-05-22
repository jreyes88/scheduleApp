$(function() {


    function clearErrors(el) {
        var par = $(el).closest('.has-error');
        par.removeClass('has-error');
        par.find('.help-block').hide();
    }

    // done munging css, show the page
    $('body').show();

    // read more... links for description
    if($('.trainingDescription').length > 0) {

        opts = {
            preserveWords: true,
            slicePoint: 400,
            expandText: regLinks.more,
            userCollapseText: regLinks.less,
            expandPrefix: "&hellip;",
            expandEffect: 'show',
            expandSpeed: 0,
            collapseEffect: 'hide',
            collapseSpeed: 0
        };

        $('.trainingDescription').expander(opts);
    }

    // toggle display of old dates for recurring session
    $('.recurring-sessions').on('click', function(e){
        e.preventDefault();
        $('.trainingTimes .past, .trainingTimes .far-future').toggle();
    });

    // show character limits on active field
    $('[type=text], [type=email], textarea').charlimit();

    // clear error messages when field is valid
    $('[type=text], [type=email], textarea').on('focus change keyup',function(){
        if(this.value.length > 0) {
            clearErrors(this);
        }
    });
    $( 'select' ).on('change',function() {
        if($(this).find('option:selected').val().length > 0) {
            clearErrors(this)
        }
    });

    //On clicking show in my timezone link, launch the modal
    $(".launch-tz-modal").on('click', function(e){
        e.preventDefault();
        $('#timezone-modal').modal('show');
    });

    // Focus on first registration form field
    $("#registrationForm :input:visible:enabled:first").focus();

    // automatically show cancel modal on registration confirm as needed
    if($('#registrationConfirmation #showCancel').text() === 'true') {
        $('#cancel-dialog').modal('show');
    }

});



/*
 * Plugin for displaying charlimit counters above input fields
 * Author: Lucas Myers
 * Last Updated: 1/22/2014
 * Verified: Unit Tests: null, jsLint: null
 */
(function($) {
    var methods = {
            init: function(options) {
                var that = this;
                return this.each(function(){
                    var $this = $(this);
                    var opts = $.extend({}, $.fn.charlimit.defaults, options);

                    // run limiter if maxlength is set
                    if($this.prop('maxLength') > 0) {
                        limit($this,$this.prop('maxLength'));
                    }

                });
            }
        },

        limit = function(el,max) {

            // setup counter
            if(el.parent().find('.charlimit').length === 0) {
                el.before('<span class="charlimit" style="display:none;">'+max+'</span>');
            }
            var counter = el.parent().find('.charlimit');
            counter.hide();

            // show count when input is active
            el.on('focus',function() {
                counter.show();
            });

            // hide count when inactive
            el.on('blur',function() {
                counter.hide();
            });

            // update counter
            el.on('focus click blur change keyup keypress keydown',function(e, max) {
                var len = this.maxLength - this.value.length;
                counter
                    .removeClass('danger warning')
                    .html(len);
                if(len === 0){
                    counter.addClass('danger');
                }
                else if(len < 20){
                    counter.addClass('warning');
                }
            });
        };

    $.fn.charlimit = function(options) {
        if (methods[options]) {
            return methods[ options ].apply(this, Array.prototype.slice.call( arguments, 1 ));
        } else if (typeof options === 'object' || ! options) {
            return methods.init.apply(this, arguments);
        } else {
            $.error( 'Method ' +  method + ' does not exist' );
        }
    };

    $.fn.charlimit.defaults = {};

})(jQuery);
