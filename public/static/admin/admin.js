layui.extend({
    setting:'setting'
}).define(['element','dropdown','jquery','layer','setting'], function(exports) {
    let element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
    // let dropdown = layui.dropdown;
    let $ = layui.jquery;
    let layer = layui.layer;

    let admin = {
        curIframeIndex:0,
        open:openPage,
        tabs:[],
        indexPage:null,
        refresh:refresh,
        flexible:flexible,
        popup:popup,
        iframeLoading:iframeLoading
    };
    admin.indexPage = $('body');

    /**
     * 刷新iframe
     */
    function refresh (obj) {
        let curIframe = $(".layui-tab-content .layui-tab-item").eq(admin.curIframeIndex).find("iframe")[0];
        let _this = $(obj)
        _this.children('i').removeClass('layui-icon-refresh-3');
        _this.children('i').addClass('layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop');

        admin.iframeLoading();
        setTimeout(function () {
                _this.children('i').removeClass('layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop');
                _this.children('i').addClass('layui-icon-refresh-3');
            },1000);
        curIframe.contentWindow.location.reload(true);
    }

    function isMobile() {
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
            return true
        }
        return false
    }

    function hoverEvent(is_hover){
        if (is_hover === undefined){
            console.log('is_hover',is_hover)
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




    function flexible(){
        let navwidth = '232px';
        let snavwidth = '70px';
        let mnavwidth = '0px';
        let tnavwidth = 200;
        $('#ia_side_menu_flexible').toggleClass('layui-icon-spread-left');
        $('#ia_side_menu_flexible').toggleClass('layui-icon-spread-right');
        if (isMobile()) {
            $('#IA_layui_Tdesign_body').width(document.body.clientWidth + 'px');
            if ($('#LAY_app_flexible').hasClass('layui-icon-spread-left')) {
                $('#IA_layui_Tdesign_side').animate({ 'width': mnavwidth }, tnavwidth);
                $('#IA_layui_Tdesign .layui-body').animate({ 'left': mnavwidth }, tnavwidth);
                $('#mobilenav').removeClass('mobilenav')
            } else {
                $('#LAY_app').animate({ 'width': navwidth }, tnavwidth);
                $('#IA_layui_Tdesign .layui-body').animate({ 'left': navwidth }, tnavwidth);
                $('#IA_layui_Tdesign_side').removeClass('layui-side-shrink');
                $('#mobilenav').addClass('mobilenav')
            }
        } else {
            if ($('#ia_side_menu_flexible').hasClass('layui-icon-spread-left')) {
                $('#IA_layui_Tdesign_side').animate({ 'width': snavwidth }, tnavwidth,'swing');
                $('#IA_layui_Tdesign .layui-body').animate({ 'left': snavwidth }, tnavwidth,'swing',function () {
                    $('#IA_layui_Tdesign_side').addClass('layui-side-shrink')
                });
                $('#IA_layui_Tdesign .layui-footer').animate({ 'left': snavwidth }, tnavwidth);
                $('#IA_layui_Tdesign_header').animate({ 'left': snavwidth }, tnavwidth);
                //
                hoverEvent(true)

            } else {
                hoverEvent();
                $('#IA_layui_Tdesign_side').animate({ 'width': navwidth }, tnavwidth,'swing',function () {

                });
                $('#IA_layui_Tdesign .layui-body').animate({ 'left': navwidth }, tnavwidth,'swing',function () {

                });
                $('#IA_layui_Tdesign .layui-footer').animate({ 'left': navwidth }, tnavwidth,'swing',function () {

                });
                $('#IA_layui_Tdesign_header').animate({ 'left': navwidth }, tnavwidth,'swing',function () {
                    
                });
                $('#IA_layui_Tdesign_side').removeClass('layui-side-shrink')
            }
        }
    }

    function popup(obj){
        let url = $(obj).data('href');
        let title = $(obj).text()
        if (url !== ''){
            layer.open({
                type: 2, //类型，解析url
                closeBtn: 1, //关闭按钮是否显示 1显示0不显示
                title: title, //页面标题
                shadeClose: true, //点击遮罩区域是否关闭页面
                shade: 0.8,  //遮罩透明度
                area: ['900px', '500px'],  //弹出层页面比例
                content: url //弹出层的url
            });
        }
    }

    function openPage(url,title,id){
        handleTagChange(id,url,title)
    }

    element.on('nav(layadmin-layout-left)', function(elem) {
        var event = elem[0].getAttribute('layadmin-event');
        switch (event) {
            case 'flexible':

        }
    });

    // //菜单点击事件，其中 docDemoMenu1 对应的是菜单结构上的 id 指
    // dropdown.on('click(docSideMenu)', function(options){
    //     // let othis = $(this); //当前菜单列表的 DOM 对象
    //     console.log(111)
    //     // console.log(options); //菜单列表的 lay-options 中的参数
    // });

    function iframeLoading(){
        let loafingHtml = "<div class='ia-loading'><div><i class='layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop' style='font-size: 50px'></i></div></div>";
        let loading = $(loafingHtml);
        $(".layui-layout-admin .layui-body .layui-tab-content").append(loading)
        $(".layui-layout-admin .layui-body .layui-tab-content").attr('height',0)
        setTimeout(function () {
            $(".layui-layout-admin .layui-body .layui-tab-content").removeAttr('height')

            $(".layui-layout-admin .layui-body .layui-tab-content .ia-loading").remove()
        },1000)
    }

    function handleTagChange(id,href,title){
        let isHasTab = false;
        admin.tabs.map(function (item){
            if (id === item.id){
                element.tabChange('window-tab', id); //切换到：用户管理
                isHasTab = true;
            }
        })
        if (href !== undefined && !isHasTab){
            admin.iframeLoading();
            //新增一个Tab项
            element.tabAdd('window-tab', {
                title: title//用于演示
                ,content:  '<iframe id="' + id + '" data-frameid="' + id + '" frameborder="0" scrolling="auto" src="' +
                    href + '" style="width:100%;height:100%;"></iframe>'
                ,id: id //实际使用一般是规定好的id，这里以时间戳模拟下
            })
            admin.tabs.push({id:id,href:href,title:title})
            element.tabChange('window-tab', id); //切换到：用户管理
        }
    }

    element.on('tabDelete(window-tab)', function(data){
        admin.tabs.splice(data.index,1)
    });

    // 监听事件
    admin.indexPage.on('click', '*[ia-event]', function(){
        let _this = $(this)
            ,attrEvent = _this.attr('ia-event');
        if (admin[attrEvent]){
            admin[attrEvent].call(this, _this);
        }
    })

    //监听导航点击
    element.on('nav(side_menu)', function(elem){
        let href = $(elem).data('href');
        let hrefId = $(elem).attr('menu-id');
        let openType = $(elem).attr('ia-open-type');
        handleTagChange(hrefId,href,elem.text())
    });

    //监听tab点击
    element.on('tab(window-tab)', function(data){
        admin.curIframeIndex = data.index
        let lay_id=$(this).attr("lay-id");
        let nav_tree=$(".layui-nav-tree");
        //移除其他选中
        nav_tree.find("a[menu-id]").parent().removeClass("layui-this");
        //选中点击的
        let kv="a[menu-id='"+lay_id+"']";
        let p = nav_tree.find(kv).parents('.layui-nav-item');
        if (!p.hasClass('layui-nav-itemed')){
            p.addClass('layui-nav-itemed')
        }
        nav_tree.find(kv).parent().addClass("layui-this")
    });

    //监听导航点击
    element.on('nav(header_menu)', function(elem){
    });

    // <i class="layui-icon layui-icon-home"></i>
    exports('admin',admin);
});