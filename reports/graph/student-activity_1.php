<?php
include_once '../Events.php';

$event = new Events(1, 1000, 'Viewed');
$res = $event->makeCurl();

$final_res = array('0' => array('name' => 'All Results', 'dt' => array()));
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

            $final_res[$kkId]['dt'][0][$week] = $name;
            if (isset($final_res[$kkId]['dt'][$user_id]['data'][$week]['y'])) {
                $final_res[$kkId]['dt'][$user_id]['data'][$week]['y'] ++;
            } else {
                $final_res[$kkId]['dt'][$user_id]['name'] = $value['event']['actor']['name'];
                $final_res[$kkId]['dt'][$user_id]['data'][$week]['y'] = 1;
            }
            

            $final_res['0']['dt'][0][$week] = $name;
            if (isset($final_res['0']['dt'][$user_id]['data'][$week]['y'])) {
                $final_res['0']['dt'][$user_id]['data'][$week]['y'] ++;
            } else {
                $final_res['0']['dt'][$user_id]['name'] = $value['event']['actor']['name'];
                $final_res['0']['dt'][$user_id]['data'][$week]['y'] = 1;
            }
        }
    }
}
prePrint($final_res);

$a_legends = array();
$weeks_res = array();
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
            if (empty($a_legends[$kkId])) {
                $a_legends[$kkId] = array($kkName);
            }
        }

        $ddate = gmdate("Y-m-d H:i:s", makeIsoDate($value['event']['eventTime']));
        $date = new DateTime($ddate);
        $week = $date->format("W");

        $course_id = end(explode('/', $value['event']['actor']['@id']));

        $range = getStartAndEndDate($week, date('Y', strtotime($ddate)));
        $name = date('d M', strtotime($range[0])) . " - " . date('d M`y', strtotime($range[1]));

        $weeks_res[0][$week] = $name;
        if (isset($weeks_res[$course_id]['data'][$week]['y'])) {
            $weeks_res[$course_id]['data'][$week]['y'] ++;
        } else {
            $weeks_res[$course_id]['name'] = $value['event']['actor']['name'];
            $weeks_res[$course_id]['data'][$week]['y'] = 1;
        }
    }
    prePrint($weeks_res, false);
    prePrint($a_legends);

    foreach ($weeks_res as $k => $val) {
        if ($k != 0) {
            $v = $val;
            $chk = false;
            ksort($weeks_res[0]);
            foreach ($weeks_res[0] as $kk => $vv) {
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
            $weeks_res[$k] = $v;
        }
    }

    $weeks_cate = $weeks_res[0];
    ksort($weeks_cate);

    $result = $weeks_res;

    foreach ($result as $k => $val) {
        if ($k != 0) {
            $result[$k]['data'] = array_column($val['data'], 'y');
        }
    }
    unset($result[0]);
    $result = array_values($result);
    
    $ar = array('title' => 'Student Activity Weekly Trend',
        'vtitle' => 'Activity Views',
        'htitle' => 'Weeks',
        'legends' => $a_legends,
        'datas' => array('cates' => array_values($weeks_cate),
            'data' => $result));
    
//    prePrint($ar);
    echo json_encode($ar);
    exit;
}