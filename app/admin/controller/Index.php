<?php
declare (strict_types = 1);

namespace app\admin\controller;

use think\Request;

class Index extends BaseController
{
    /**
     * 显示资源列表
     *
     * @return string
     */
    public function index()
    {
        return $this->fetch();
    }

    /**
     * 显示创建资源表单页.
     *
     */
    public function home()
    {
        //
        return $this->fetch();
    }
}
