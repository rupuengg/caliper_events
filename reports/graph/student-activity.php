<?php
include_once '../Events.php';

$event = new Events(1, 1000, 'Viewed');
$res = $event->makeCurl();

$a_legends = array();
$weeks_res = array();
if (!empty($res['content'])) {
    foreach ($res['content'] as $key => $value) {
        if (!empty($value['event']['object']['extensions']['assessment_type'])) {
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
            if (!empty($a_legends[$kk])) {
                array_push($a_legends[$kk], $kkName);
            } else {
                $a_legends[$kk] = array($kkName);
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
    
    $n = array();
    foreach($a_legends as $v){
        $n = array_merge($n, array_values(array_unique($v)));
    }

    foreach ($weeks_res as $k => $val) {
        if ($k != 0) {
            $v = $val;
            foreach ($weeks_res[0] as $kk => $vv) {
                if (!isset($v['data'][$kk])) {
                    $v['data'][$kk]['y'] = 0;
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
        'legends' => $n,
        'datas' => array('cates' => array_values($weeks_cate),
            'data' => $result));
    
    echo json_encode($ar);
    exit;
}
?>
<script type="text/javascript">
    var rawData = JSON.parse('<?php echo json_encode($ar); ?>');
    $(document).ready(function () {
        drawGraphs('student-activity', rawData);
    });
</script>
<script type="text/javascript" src="graphjs/grapgh.js"></script>