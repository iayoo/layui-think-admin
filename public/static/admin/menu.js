layui.extend({

}).define(['element','jquery'], function(exports) {
    let $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        element = layui.element;

    let Menu = function () {
        this.version = '1.0.0';
        this.url = '/demo/menu/menu.json';
        this.el = undefined;
    }

    Menu.prototype.render = function (option) {
        let _this = this;
        if (option.url !== undefined){
            _this.url = option.url;
        }
        if (option.el !== undefined){
            _this.el = option.el;
        }
        let menuElem = $(_this.el)
        if (menuElem.length <= 0){
            return;
        }
        // console.log(option)
        // console.log(_this)
        if (_this.url !== undefined){
            $.ajax({
                url:_this.url,
                data:{},
                type:"GET",
                success:function (res) {
                    if (res.code === 0 && res.data !== undefined && res.data.data !== undefined){
                        res.data.data.map(function (item) {
                            let liElem = $('<li class="layui-nav-item" ><a class="" href="javascript:;"><i class="layui-icon '+item.icon+'"></i><span class="title">'+item.name+'</span></a></li>');
                            if (item.children !==undefined && item.children.length > 0){
                                let cElem = $('<dl class="layui-nav-child"></dl>');
                                let cElemHtml = '';
                                item.children.map(function (cItem) {
                                    cElemHtml += '<dd><a data-href="'+cItem.href+'" menu-id="'+cItem.id+'"><span class="title">'+cItem.name+'</span></a></dd>';
                                })
                                cElem.html(cElemHtml)
                                liElem.append(cElem)
                            }
                            menuElem.append(liElem)
                            element.init();
                        })
                    }
                }
            })
        }
    }
    
    Menu.prototype.on = function (events, callback) {
        let _this = this;
        let _con = _this.config.elem;
        if (typeof (events) !== 'string') {
            // common.throwError('Navbar error:事件名配置出错，请参考API文档.');
        }
        let lIndex = events.indexOf('(');
        let eventName = events.substr(0, lIndex);
        let filter = events.substring(lIndex + 1, events.indexOf(')'));
        if (eventName === 'click') {
            if (_con.attr('lay-filter') !== undefined) {
                _con.children('ul').find('li').each(function () {
                    let $this = $(this);
                    if ($this.find('dl').length > 0) {
                        let $dd = $this.find('dd').each(function () {
                            $(this).on('click', function () {
                                let $a = $(this).children('a');
                                let href = $a.data('url');
                                let icon = $a.children('i:first').data('icon');
                                let title = $a.children('cite').text();
                                let data = {
                                    elem: $a,
                                    field: {
                                        href: href,
                                        icon: icon,
                                        title: title
                                    }
                                }
                                callback(data);
                            });
                        });
                    } else {
                        $this.on('click', function () {
                            let $a = $this.children('a');
                            let href = $a.data('url');
                            let icon = $a.children('i:first').data('icon');
                            let title = $a.children('cite').text();
                            let data = {
                                elem: $a,
                                field: {
                                    href: href,
                                    icon: icon,
                                    title: title
                                }
                            }
                            callback(data);
                        });
                    }
                });
            }
        }
    };

    exports('menu', new Menu());
})