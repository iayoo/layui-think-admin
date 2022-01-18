window.rootPath = (function(src) {
    src = document.scripts[document.scripts.length - 1].src;
    return src.substring(0, src.lastIndexOf("/") + 1);
})();

layui.extend({
    setter: 'config' //配置模块
    ,
    admin: 'lib/admin' //核心模块
    ,
    view: 'lib/view' //视图渲染模块
}).define(['setter','element','dropdown','jquery'], function(exports) {

    let element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
    // let dropdown = layui.dropdown;
    let $ = layui.jquery;

    let tabs = [];


    // //菜单点击事件，其中 docDemoMenu1 对应的是菜单结构上的 id 指
    // dropdown.on('click(docSideMenu)', function(options){
    //     // let othis = $(this); //当前菜单列表的 DOM 对象
    //     console.log(111)
    //     // console.log(options); //菜单列表的 lay-options 中的参数
    // });

    function handleTagChange(id,href,title){
        let isHasTab = false;
        tabs.map(function (item){
            if (id === item.id){
                element.tabChange('window-tab', id); //切换到：用户管理
                isHasTab = true;
            }
        })
        if (href !== undefined && !isHasTab){
            //新增一个Tab项
            let res = element.tabAdd('window-tab', {
                title: title//用于演示
                ,content:  '<iframe id="' + id + '" data-frameid="' + id + '" scrolling="auto" frameborder="0" src="' +
                    href + '" style="width:100%;height:100%;"></iframe>'
                ,id: id //实际使用一般是规定好的id，这里以时间戳模拟下
            })
            tabs.push({id:id,href:href,title:title})
            element.tabChange('window-tab', id); //切换到：用户管理
        }
    }

    element.on('tabDelete(window-tab)', function(data){
        tabs.splice(data.index,1)
    });

    //监听导航点击
    element.on('nav(side_menu)', function(elem){
        let href = $(elem).data('href');
        let hrefId = $(elem).attr('lay-id');
        handleTagChange(hrefId,href,elem.text())
    });
    // <i class="layui-icon layui-icon-home"></i>
    handleTagChange(0,'home','<i class="layui-icon layui-icon-home"></i>')

});