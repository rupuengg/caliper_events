<?php
include_once '../Events.php';

$event = new Events(1, 1000, 'LoggedIn');
$res = $event->makeCurl();

$result = array();
if (!empty($res['content'])) {
    foreach ($res['content'] as $key => $value) {
        $ddate = date("Y-m-d H:i:s", makeIsoDate($value['event']['eventTime']));
        $date = new DateTime($ddate);
        $week = $date->format("W");

        $user_id = end(explode('/', $value['event']['actor']['@id']));

        if (isset($result[$week][$user_id])) {
            $result[$week][$user_id]['y'] ++;
        } else {
            $range = getStartAndEndDate($week, date('Y', strtotime($ddate)));
            $name = date('d M', strtotime($range[0])) . " - " . date("d M`y", strtotime($range[1]));
            $result[$week][$user_id] = array('y' => 1,
                'year' => date('Y', strtotime($ddate)),
                'name' => $name,
                'range' => $range);
        }
    }
    ksort($result);

    $new_result = array('cates' => array(), 'data' => array());
    foreach ($result as $key => $value) {
        $b = array_values($value);
        array_push($new_result['cates'], $b[0]['name']);
        foreach ($value as $k => $val) {
            if (!empty($new_result['data'][$key]['total'])) {
                $new_result['data'][$key]['total']['y'] = $new_result['data'][$key]['total']['y'] + $val['y'];
            } else {
                $new_result['data'][$key]['total'] = array('y' => $val['y'], 'name' => 'Total');
            }
            if (!empty($new_result['data'][$key]['highest'])) {
                if ($val['y'] > $new_result['data'][$key]['highest']['y']) {
                    $new_result['data'][$key]['highest']['y'] = $val['y'];
                }
            } else {
                $new_result['data'][$key]['highest'] = array('y' => $val['y'], 'name' => 'Highest');
            }
            if (!empty($new_result['data'][$key]['lowest'])) {
                if ($val['y'] < $new_result['data'][$key]['lowest']['y']) {
                    $new_result['data'][$key]['lowest']['y'] = $val['y'];
                }
            } else {
                $new_result['data'][$key]['lowest'] = array('y' => $val['y'], 'name' => 'Lowest');
            }
        }
    }
    
    $data = array();
    foreach ($new_result['data'] as $key => $value) {
        $i = 0;
        foreach ($value as $k => $val) {
            if (!empty($data[$i])) {
                array_push($data[$i]['data'], $val['y']);
            } else {
                $data[$i] = array('name' => $val['name'], 'data' => array($val['y']));
            }
            $i++;
        }
    }
    $new_result['data'] = $data;

    $ar = array('title' => 'Student Weekly Logged-In Session Report',
        'vtitle' => 'Logged-In Count',
        'htitle' => 'Weeks',
        'datas' => $new_result);
    
    echo json_encode($ar);
    exit;
}
?>
<script type="text/javascript">
    var rawData = JSON.parse('<?php echo json_encode($ar); ?>');
    $(document).ready(function () {
        drawGraphs('weekly-session-other', rawData);
    });
</script>
<script type="text/javascript" src="graphjs/grapgh.js"></script>