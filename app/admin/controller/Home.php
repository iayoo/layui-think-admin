<?php

namespace app\admin\controller;

class Home extends BaseController
{
    public function index(){
        return $this->fetch();
    }
}