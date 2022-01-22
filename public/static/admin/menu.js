layui.extend({

}).define(['element','jquery'], function(exports) {
    let $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        element = layui.element;

    let Menu = function () {
        this.version = '1.0.0';
        this.url = '/demo/menu/menu.json';
        this.el = undefined;
        this.header_el = undefined;
        this.menu_list = [];
        this.is_header = false;
        this.cur_header_index = 0;
        this.change = undefined;
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
        let headerEl = undefined;
        if (option.header_el !== undefined){
            _this.header_el = option.header_el
            headerEl = $(option.header_el)
            _this.is_header = true;
        }
        if (_this.url !== undefined){
            $.ajax({
                url:_this.url,
                data:{},
                type:"GET",
                success:function (res) {
                    if (res.code === 0 && res.data !== undefined && res.data.data !== undefined){
                        _this.menu_list = res.data.data;
                        if (_this.is_header && _this.header_el !== undefined){
                            res.data.data.map(function (item,index) {
                                headerEl.append('<li class="layui-nav-item layui-hide-xs '+ (index===_this.cur_header_index?'layui-this':'') +'"><a data-href="" menu-id="'+item.id+'">'+item.name+'</a></li>')
                            })
                            _this.renderSideMenu(menuElem,_this.menu_list[_this.cur_header_index].children)
                            //监听导航点击
                            element.on('nav('+_this.header_el.replace('#','')+')', function(elem){
                                let menu_id = $(elem).attr('menu-id')
                                _this.menu_list.map(function (item,index) {
                                    if (item.id.toString() === menu_id.toString() && index !== _this.cur_header_index){
                                        _this.cur_header_index = index;
                                        _this.renderSideMenu(menuElem,item.children)
                                        element.init();
                                    }
                                })
                            });
                        }else{
                            _this.renderSideMenu(menuElem,res.data.data)
                        }
                        element.init();
                    }
                },
                error:function (res) {
                }
            })
        }
    }

    Menu.prototype.renderSideMenu = function (el,data){
        let _this = this;
        $(el).empty();
        data.map(function (item) {
            let liElem = $('<li class="layui-nav-item" ><a class="" data-href="'+(item.href === undefined?'javascript:;':item.href)+'"><i class="layui-icon '+item.icon+'"></i><span class="title">'+item.name+'</span></a></li>');
            if (item.children !==undefined && item.children.length > 0){
                let cElem = $('<dl class="layui-nav-child"></dl>');
                let cElemHtml = '';
                item.children.map(function (cItem) {
                    cElemHtml += '<dd><a data-href="'+cItem.href+'" menu-id="'+cItem.id+'"><span class="title">'+cItem.name+'</span></a></dd>';
                })
                cElem.html(cElemHtml)
                liElem.append(cElem)
            }
            $(el).append(liElem)
        })
        //监听导航点击
        element.on('nav('+ $(el).attr('id') +')', function(elem){
            let href = $(elem).data('href');
            if (href === undefined || href === ''){
                return;
            }
            let hrefId = $(elem).attr('menu-id');
            if (_this.change !== undefined){
                _this.change(hrefId,href,elem.text());
            }
        });
        element.init();
    }

    exports('menu', new Menu());
})