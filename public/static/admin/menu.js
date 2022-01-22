layui.extend({

}).define(['element','jquery'], function(exports) {
    let $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        element = layui.element;

    let THIS = 'layui-this',SHRINK_BTN = 'shrink_btn',REFRESH_BTN='refresh_btn'

    let menu = {
        set:function (options){
            let that = this;
            $.extend({}, that.config, options);
            return that;
        }
    }
    let navwidth = '232px';
    let snavwidth = '70px';
    let mnavwidth = '0px';
    let tnavwidth = 200;
    let Menu = function () {
        this.config = {
            url:'/demo/menu/menu.json',
            nav:{
                width:'232px',
                shrink_width:'70px',
                time:200
            },
            is_refrech:true,
            is_shrink:true
        };
        this.el = {}
        this.ver = '1.0.0';
        this.menu_list = [];
        this.is_header = false;
        this.cur_header_index = 0;
    }


    Menu.prototype.set = function (options) {
        let that = this;
        $.extend(true, that.config, options);
        return that;
    }

    Menu.prototype.render = function (option) {
        $.extend(true, this.config, option);
        let that = this,options = that.config;
        options.el = $(options.el);
        if (options.el.length <= 0){
            return;
        }
        if (options.header_el !== undefined){
            options.header_el = $(options.header_el)
            options.is_header = true;
        }
        if (options.url !== undefined){
            $.ajax({
                url:options.url,
                data:{},
                type:"GET",
                success:function (res) {
                    if (res.code === 0 && res.data !== undefined && res.data.data !== undefined){
                        that.menu_list = res.data.data;
                        that.renderHeaderMenu()
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

    Menu.prototype.flexible = function (isMobile) {
        // let navwidth = '232px';
        // let snavwidth = '70px';

        let options = this.config,that = this;
        let mnavwidth = '0px';
        that.el[SHRINK_BTN].find('a i').toggleClass('layui-icon-spread-left');
        that.el[SHRINK_BTN].find('a i').toggleClass('layui-icon-spread-right');
        if (isMobile) {
            $('#IA_layui_Tdesign_body').width(document.body.clientWidth + 'px');
            if ($('#LAY_app_flexible').hasClass('layui-icon-spread-left')) {
                $('#IA_layui_Tdesign_side').animate({ 'width': mnavwidth }, options.nav.time);
                $('#IA_layui_Tdesign .layui-body').animate({ 'left': mnavwidth }, options.nav.time);
                $('#mobilenav').removeClass('mobilenav')
            } else {
                $('#LAY_app').animate({ 'width': options.nav.width }, options.nav.time);
                $('#IA_layui_Tdesign .layui-body').animate({ 'left': options.nav.width }, options.nav.time);
                $('#IA_layui_Tdesign_side').removeClass('layui-side-shrink');
                $('#mobilenav').addClass('mobilenav')
            }
        } else {
            if (that.el[SHRINK_BTN].find('a i').hasClass('layui-icon-spread-left')) {
                $('#IA_layui_Tdesign_side').animate({ 'width': options.nav.shrink_width }, options.nav.time,'swing');
                $('#IA_layui_Tdesign .layui-body').animate({ 'left': options.nav.shrink_width }, options.nav.time,'swing',function () {
                    $('#IA_layui_Tdesign_side').addClass('layui-side-shrink')
                    handleEvent(true)
                });
                $('#IA_layui_Tdesign .layui-footer').animate({ 'left': options.nav.shrink_width }, options.nav.time);
                $('#IA_layui_Tdesign_header').animate({ 'left': options.nav.shrink_width }, options.nav.time);
                //

            } else {
                handleEvent();
                $('#IA_layui_Tdesign_side').animate({ 'width': options.nav.width }, options.nav.time,'swing');
                $('#IA_layui_Tdesign .layui-body').animate({ 'left': options.nav.width }, options.nav.time,'swing');
                $('#IA_layui_Tdesign .layui-footer').animate({ 'left': options.nav.width }, options.nav.time,'swing');
                $('#IA_layui_Tdesign_header').animate({ 'left': options.nav.width }, options.nav.time,'swing');
                $('#IA_layui_Tdesign_side').removeClass('layui-side-shrink')
            }
        }
    }

    Menu.prototype.renderHeaderMenu = function () {
        let that = this,options = that.config;
        if (options.header_el === undefined || !options.is_header){
            that.renderSideMenu(options.el,that.menu_list)
            element.init();
            return;
        }

        if (options.is_shrink){
            that.el[SHRINK_BTN] = getNavItem(null,'',true,"layui-icon-shrink-right",'flexible');
            options.header_el.append(that.el[SHRINK_BTN]);
        }

        if (options.is_refrech){
            that.el[REFRESH_BTN] = getNavItem(null,'',true,"layui-icon-refresh-3",'refresh');
            options.header_el.append(that.el[REFRESH_BTN]);
        }


        that.menu_list.map(function (item,index) {
            options.header_el.append('<li class="layui-nav-item '+ (index===that.cur_header_index? THIS :'') +'"><a data-href="" menu-id="'+item.id+'">'+item.name+'</a></li>')
        })
        that.renderSideMenu(options.el,that.menu_list[that.cur_header_index].children)
        //监听导航点击
        element.on('nav('+options.header_el.attr('id')+')', function(elem){
            let menu_id = $(elem).attr('menu-id')
            if (menu_id === undefined){
                return false;
            }
            that.menu_list.map(function (item,index) {
                if (item.id.toString() === menu_id.toString() && index !== that.cur_header_index){
                    that.cur_header_index = index;
                    that.renderSideMenu(options.el,item.children)
                    element.init();
                }
            })
        });
    }

    function handleEvent(is_hover){
        if (is_hover === undefined){
            $(".layui-side-shrink .layui-nav-tree .layui-nav-item,.layui-side-shrink .layui-nav-tree dd").off('mouseenter').unbind('mouseleave');
            return;
        }
        $(".layui-side-shrink .layui-nav-tree .layui-nav-item,.layui-side-shrink .layui-nav-tree dd").hover(function(e){
            let _this = $(this);
            if (_this.hasClass('layui-nav-item')){
                let topLength = _this.offset().top -10;
                if (e.type === 'mouseleave'){
                    _this.children('.layui-nav-child').fadeOut(200,function () {
                        _this.children('.layui-nav-child').removeAttr('style')
                    })
                }
                if (e.type === 'mouseenter'){
                    _this.children(".layui-nav-child").css({
                        top: topLength,
                    });
                    _this.children('.layui-nav-child').fadeIn(500)
                }

            }
        });
    }

    function getNavItem(href,title,unselect,icon,event){
        unselect = unselect?'lay-unselect':''
        icon = typeof icon === 'string'?icon:''
        href = href?('data-href="'+href +'"'):'href="javascript:;"';
        event = event?('ia-event="'+event +'"'):'';
        return $('<li class="layui-nav-item" '+ unselect +'><a '+ event + ' '+ href +'><i class="layui-icon '+ icon +'"></i></a></li>')
    }

    exports('menu', new Menu());
})