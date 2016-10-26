<?php
include_once '../Events.php';

$event = new Events(1, 1000, 'Viewed');
$res = $event->makeCurl();

$final_res = array('0' => array('name' => 'All Results', 'cates' => array(), 'dt' => array()));
if (!empty($res['content'])) {
    foreach ($res['content'] as $key => $value) {
        if (!empty($value['event']['object']['extensions']['assessment_type'])) {
            $kkId = end(explode('/', $value['event']['object']['@id']));
            $kk = $value['event']['object']['extensions']['assessment_type'];
            $kkName = '';
            switch($kk){
                case 'book':
                    $kkName = $value['event']['object']['name'];
                    break;
                case 'quiz':
                    $kkName = $value['event']['object']['name'];
                    break;
                case 'forum':
                    $kkName = $value['event']['object']['name'];
                    break;
            }
            if (empty($final_res[$kkId])) {
                $final_res[$kkId] = array('name' => $kkName);
            }
            
            $ddate = gmdate("Y-m-d H:i:s", makeIsoDate($value['event']['eventTime']));
            $date = new DateTime($ddate);
            $week = $date->format("W");

            $user_id = end(explode('/', $value['event']['actor']['@id']));

            $range = getStartAndEndDate($week, date('Y', strtotime($ddate)));
            $name = date('d M', strtotime($range[0])) . " - " . date('d M`y', strtotime($range[1]));

            $final_res[$kkId]['cates'][$week] = $name;
            if (isset($final_res[$kkId]['dt'][$user_id]['data'][$week]['y'])) {
                $final_res[$kkId]['dt'][$user_id]['data'][$week]['y'] ++;
            } else {
                $final_res[$kkId]['dt'][$user_id]['name'] = $value['event']['actor']['name'];
                $final_res[$kkId]['dt'][$user_id]['data'][$week]['y'] = 1;
            }
            

            $final_res['0']['cates'][$week] = $name;
            if (isset($final_res['0']['dt'][$user_id]['data'][$week]['y'])) {
                $final_res['0']['dt'][$user_id]['data'][$week]['y'] ++;
            } else {
                $final_res['0']['dt'][$user_id]['name'] = $value['event']['actor']['name'];
                $final_res['0']['dt'][$user_id]['data'][$week]['y'] = 1;
            }
        }
    }
    
    foreach($final_res as $f_key=>$f_rea){
        $weeks_res = $f_rea['dt'];
        foreach ($weeks_res as $k => $val) {
            if ($k != 0) {
                $v = $val;
                $chk = false;
                ksort($f_rea['cates']);
                foreach ($f_rea['cates'] as $kk => $vv) {
                    if (isset($v['data'][$kk])) {
                        $chk = true;
                    }
                    if (!isset($v['data'][$kk])) {
                        if ($chk)
                            $v['data'][$kk]['y'] = 0;
                        else
                            $v['data'][$kk]['y'] = '';
                    }
                }
                ksort($v['data']);
                $final_res[$f_key]['dt'][$k] = $v;
                $final_res[$f_key]['dt'][$k]['data'] = array_column($v['data'], 'y');
            }
        }
        ksort($final_res[$f_key]['cates']);
        $final_res[$f_key]['cates'] = array_values($final_res[$f_key]['cates']);
        $final_res[$f_key]['dt'] = array_values($final_res[$f_key]['dt']);
    }
//    prePrint($final_res);
    
    $ar = array('title' => 'Student Activity Weekly Trend',
        'vtitle' => 'Activity Views',
        'htitle' => 'Weeks',
        'fKey' => '0',
        'datas' => $final_res);
    
    echo json_encode($ar);
    exit;
}