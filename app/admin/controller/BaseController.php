<?php
declare (strict_types = 1);

namespace app\admin\controller;

use think\facade\View;
use think\Request;

class BaseController extends \app\BaseController
{

    protected function fetch($template = '', array $vars = []){
        return View::fetch($template, $vars);
    }
}
