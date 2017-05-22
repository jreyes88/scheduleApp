
(function($) {


    function downloadImg($img, url){
        var loaded = false;
        if($img.length > 0){
            var imgObj = new Image();
            imgObj.onload = function(){
                $img.attr('src', this.src);
            };
            imgObj.onerror = function(){

                $img.remove();
            };
            imgObj.src = url;
        }
    }

    function downloadCss(url){
        var link;

        var url = url,
            head = document.getElementsByTagName('head')[0],
            link = document.createElement('link');
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        link.onload = function(){
            applyThemeButtonColor();
        };
        head.appendChild(link);
    }

    function applyThemeButtonColor(){
        var opts,
            hoverColor,
            hoverBorderColor,
            borderColor,
            bgColor = $('html').css('background-color'),
            headerColor = $('.hero-unit h1').css('color');

        // fix custom styles
        $('body').css({'background-color': bgColor});
        $('html').css({'background': '#444'});

        // change button color and h3 headers to heading color if it is a custom color
        if($.Color(headerColor).toRgbaString() !== 'rgb(17,76,127)') {
            borderColor = $.Color(headerColor).lightness(.4);
            hoverColor = $.Color(headerColor).lightness(.6);
            hoverBorderColor = $.Color(headerColor).lightness(.7);

            //.addthisevent : this 3rd party calendar app has conflict against additional class .btn-primary, so added id as its selector
            $('.btn-primary, #addthisevent').css({'background-color' : headerColor, 'border-color' : borderColor});

            $('.btn-primary, #addthisevent')
                .on( 'mouseenter', function() {
                    $( this ).css({
                        'background-color': hoverColor,
                        'border-color': hoverBorderColor
                    });
                })
                .on( 'mouseleave', function() {
                    var styles = {
                        'background-color' : headerColor,
                        'border-color' : borderColor
                    };
                    $( this ).css( styles );
                });
            $('#registrationConfirmation h3').css({'color':headerColor});
        }
    }

    $(window).load(function(){
        var brandingInfo = window.brandingInfo || {};

        var $logoImg = $('.logoImg'),
            $themeImg = $('.themeImg');

        if( brandingInfo.logoUrl ){
            downloadImg($logoImg, brandingInfo.logoUrl);
        }
        if( brandingInfo.customImageUrl ){
            downloadImg($themeImg, brandingInfo.customImageUrl);
        }
        if( brandingInfo.themeCssUrl ) {
            downloadCss(brandingInfo.themeCssUrl);
        }
    });

})(jQuery);
