<?php
include_once '../Events.php';

$event = new Events(1, 1000, 'LoggedIn');
$res_logged_in = $event->makeCurl();

$event = new Events(1, 1000, 'LoggedOut');
$res_logged_out = $event->makeCurl();

$f_session = $user_list = $result = array();

foreach($res_logged_in['content'] as $key=>$value){
    foreach($res_logged_out['content'] as $k=>$val){
        if(!in_array($value['event']['federatedSession'], $f_session) && $value['event']['federatedSession'] == $val['event']['federatedSession']){
            $user_id = end(explode('/', $value['event']['actor']['@id']));
            if($user_id != 2){
                if(!isset($result[$user_id]))
                    $result[$user_id] = array();

                $a = array('name' => $value['event']['actor']['name'],
                    'startedAtTime' => date("H:i:s", makeIsoDate($value['event']['generated']['startedAtTime'])),
                    'endedAtTime' => date("H:i:s", makeIsoDate($val['event']['object']['endedAtTime'])));

                if(!empty($a['startedAtTime']) && !empty($a['endedAtTime'])){
                    $a['diff'] = round(abs(strtotime($a['endedAtTime']) - strtotime($a['startedAtTime'])) / 60, 1);
                }

    //            $d = date('d M\'y', makeIsoDate($value['event']['generated']['startedAtTime']));
    //            $d = gmdate("d/m/Y", makeIsoDate($value['event']['generated']['startedAtTime']));
                $d = gmdate("Y/m/d", makeIsoDate($value['event']['generated']['startedAtTime']));

                if(!empty($result[$user_id][$d])){
                    array_push($result[$user_id][$d], $a);
                }else{
                    $result[$user_id][$d] = array($a);
                }

                $user_list[$user_id] = $value['event']['actor']['name'];

                array_push($f_session, $value['event']['federatedSession']);
            }
        }
    }
}

$outputs = array();
foreach($result as $ukey=>$user){
    ksort($user);
    $vvv = array();
    foreach(array_keys($user) as $v){
        array_push($vvv, date('d M\'y', strtotime($v)));
    }
    $outputs[$ukey]['cates'] = $vvv;
    foreach($user as $key=>$value){
        foreach($value as $k=>$val){
            if(!isset($outputs[$ukey]['datas'][$k]['data']))
                $outputs[$ukey]['datas'][$k]['data'] = array();

            array_push($outputs[$ukey]['datas'][$k]['data'], $val['diff']);
        }
    }
}
    
$ar = array('title' => 'Student Session Duration(Daily Report)',
    'vtitle' => 'Session length (in mins)',
    'htitle' => 'Year - 2016',
    'fKey' => reset(array_keys($user_list)),
    'user_list' => $user_list,
    'datas' => array('data' => $outputs));

echo json_encode($ar);
exit;