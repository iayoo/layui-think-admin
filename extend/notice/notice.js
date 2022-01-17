(function (define) {
    define(['jquery'], function ($) {
        console.log(1)

        return (function () {


            let notice = {
                // clear: clear,
                // remove: remove,
                // error: error,
                // getContainer: getContainer,
                // info: info,
                options: {},
                // subscribe: subscribe,
                // success: success,
                // version: '2.1.4',
                // warning: warning

            };

            notice.toast = function (message,times){
                // console.log(2222)
                // console.log($("body", top.document).html())
                notice.options.times = times??1500;
                notice.options.message = message??'';
                show()
            }

            function show(){
                // <div class="t-notification__icon"><svg fill="none" viewBox="0 0 16 16" width="1em" height="1em" class="t-icon t-icon-info-circle-filled t-is-warning"><path fill="currentColor" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7.4 4h1.2v1.2H7.4V4zm.1 2.5h1V12h-1V6.5z" fill-opacity="0.9"></path></svg></div>
                let html = "<div class='ia-notification'>" +
                    '<div class="icon"><svg fill="none" viewBox="0 0 16 16" width="1em" height="1em" class="t-icon t-icon-info-circle-filled t-is-warning"><path fill="currentColor" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7.4 4h1.2v1.2H7.4V4zm.1 2.5h1V12h-1V6.5z" fill-opacity="0.9"></path></svg></div>' +
                    '<div class="main"><div class="title_contain"><span class="title">告警通知</span><span class="message_close"></span></div><div class="content">这是一条告警的消息通知</div></div>' +
                    "</div>";
                let elm = $(html);
                elm.hide()
                let noticeContainElm = $(".ia-notification_list", top.document);

                if (noticeContainElm.length <= 0){
                    let noticeContainElmHtml = "<div class='ia-notification_list'></div>";
                    noticeContainElm = $(noticeContainElmHtml);
                    $("body", top.document).append(noticeContainElm);
                }
                noticeContainElm.append(elm)
                elm.fadeTo(500, 1, function() {
                    console.log('完成');
                })
                // let out = setTimeout (function () {
                //     elm.fadeOut(500)
                // }, notice.options.times)

        }

            return notice;

        })();

    })

}(typeof define === 'function' && define.amd ? define : function (deps, factory) {
    if (typeof module !== 'undefined' && module.exports) { //Node
        module.exports = factory(require('jquery'));
    }
    else if (window.layui && layui.define){
        layui.define('jquery', function (exports) { //layui加载
            exports('toast', factory(layui.jquery));
            exports('notice', factory(layui.jquery));
        });
    }
    else {
        window.toast = factory(window.jQuery);
    }
}));
