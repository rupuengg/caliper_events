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

        if (isset($result[$week])) {
            $result[$week]['y'] ++;
            $result[$week]['users'][$user_id] = 0;
        } else {
            $range = getStartAndEndDate($week, date('Y', strtotime($ddate)));
            $name = date('d M', strtotime($range[0]))." - ".date("d M`y", strtotime($range[1]));
            $result[$week] = array('y' => 1, 
                'year' => date('Y', strtotime($ddate)), 
                'name' => $name, 
                'range' => $range,
                'users' => array($user_id => 0));
        }
    }
    
    ksort($result);
    $resp = array();
    foreach($result as $res){
//        $res['y'] = count($res['users']);
        array_push($resp, $res);
    }
    
    $ar = array('title' => 'Student Weekly Logged-In Session Report',
        'vtitle' => 'Logged-In Count',
        'htitle' => 'Weeks',
        'datas' => $resp);
    
    echo json_encode($ar);
    exit;
}
?>
<script type="text/javascript">
    var rawData = JSON.parse('<?php echo json_encode($ar); ?>');
    $(document).ready(function () {
        drawGraphs('weekly-session', rawData);
    });
</script>
<script type="text/javascript" src="graphjs/grapgh.js"></script>