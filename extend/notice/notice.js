(function (define) {
    define(['jquery'], function ($) {
        console.log(1)

        return (function () {


            let notice = {
                clear: clear,
                stack:[],
                index:0,
                icon:'',
                error: error,
                info: info,
                options: {
                    title:'',
                    message:'',
                    time:1000,
                },
                success: success,
                version: '1.0.0',
                warning: warning
            };



            function warning(message,time){
                notice.icon = '<svg fill="none" viewBox="0 0 16 16" width="1em" height="1em" class="t-icon t-icon-info-circle-filled t-is-warning"><path fill="currentColor" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7.4 4h1.2v1.2H7.4V4zm.1 2.5h1V12h-1V6.5z" fill-opacity="0.9"></path></svg>';
                show(message,time);
            }

            function info(message,time){
                notice.icon = '<svg fill="none" viewBox="0 0 16 16" width="1em" height="1em" class="t-icon t-icon-info-circle-filled t-is-warning"><path fill="currentColor" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7.4 4h1.2v1.2H7.4V4zm.1 2.5h1V12h-1V6.5z" fill-opacity="0.9"></path></svg>';
                show(message,time);
            }

            function error(message,time){
                notice.icon = '<svg fill="none" viewBox="0 0 16 16" width="1em" height="1em" class="t-icon t-icon-check-circle-filled t-is-success"><path fill="currentColor" d="M8 15A7 7 0 108 1a7 7 0 000 14zM4.5 8.2l.7-.7L7 9.3l3.8-3.8.7.7L7 10.7 4.5 8.2z" fill-opacity="0.9"></path></svg>';
                show(message,time);
            }

            function success(message,time){
                notice.icon = '<svg fill="none" viewBox="0 0 16 16" width="1em" height="1em" class="t-icon t-icon-check-circle-filled t-is-success"><path fill="currentColor" d="M8 15A7 7 0 108 1a7 7 0 000 14zM4.5 8.2l.7-.7L7 9.3l3.8-3.8.7.7L7 10.7 4.5 8.2z" fill-opacity="0.9"></path></svg>';
                show(message,time);
            }

            function clear(index){
                if (index !== undefined){
                    $("#ia-notification_"+index, top.document).fadeOut();
                    if (notice.stack[index] !== undefined){
                        notice.stack[index] = undefined;
                    }
                    return true;
                }
                let elmList = $(".ia-notification_list > .ia-notification", top.document);
                for (let i = 0;i<elmList.length;i++){
                    $(elmList[i]).fadeOut();
                    setTimeout(function (){
                        $(elmList[i]).remove();
                    },500)
                }
            }

            notice.toast = function (message,times){
                notice.options.time = times??1500;
                notice.options.message = message??'';
                show()

            }

            function show(message,time){

                if (typeof message ==="string" ){
                    notice.options.message = message;
                }

                if (time!== undefined){
                    notice.options.time = time
                }

                if (typeof message === 'object'){
                    let keys = Object.keys(message)
                    keys.map(function (item) {
                        notice.options[item] = message[item]
                    })
                }

                notice.index+=1
                // <div class="t-notification__icon"><svg fill="none" viewBox="0 0 16 16" width="1em" height="1em" class="t-icon t-icon-info-circle-filled t-is-warning"><path fill="currentColor" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7.4 4h1.2v1.2H7.4V4zm.1 2.5h1V12h-1V6.5z" fill-opacity="0.9"></path></svg></div>
                let html = "<div class='ia-notification' id='ia-notification_" + notice.index + "'>" +
                    '<div class="icon">'+ notice.icon +'</div>' +
                    '<div class="main"><div class="title_contain"><span class="title">' +
                    notice.options.title +
                    '</span><span class="message_close"></span></div><div class="content">' +
                    notice.options.message + '</div></div>' +
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
                    notice.options = {
                        message:'',
                        title:'',
                        time:1500,
                    }
                })
                let out = setTimeout (function () {
                    elm.fadeOut(500)
                }, notice.options.time)

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
