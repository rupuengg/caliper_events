<?php
include_once '../Events.php';

$event = new Events(1, 1000, 'NavigatedTo');
$res = $event->makeCurl();

$weeks_res = array();
if (!empty($res['content'])) {
    foreach ($res['content'] as $key => $value) {
        $ddate = gmdate("Y-m-d H:i:s", makeIsoDate($value['event']['eventTime']));
        $date = new DateTime($ddate);
        $week = $date->format("W");

        $course_id = end(explode('/', $value['event']['group']['@id']));

        $range = getStartAndEndDate($week, date('Y', strtotime($ddate)));
        $name = date('d M', strtotime($range[0])) . " - " . date('d M`y', strtotime($range[1]));

        $weeks_res[0][$week] = $name;
        if (isset($weeks_res[$course_id]['data'][$week]['y'])) {
            $weeks_res[$course_id]['data'][$week]['y'] ++;
        } else {
            $weeks_res[$course_id]['name'] = $value['event']['group']['name'];
            $weeks_res[$course_id]['data'][$week]['y'] = 1;
        }
    }
    
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
//                    if ($chk)
//                        $v['data'][$kk]['y'] = 0;
//                    else
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
}

$ar = array('title' => 'Weekly Courses Popularity',
    'vtitle' => 'Course Views',
    'htitle' => 'Weeks',
    'datas' => array('cates' => array_values($weeks_cate),
        'data' => $result));

echo json_encode($ar);
exit;