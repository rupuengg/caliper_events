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
            
            if(!isset($result[$user_id]))
                $result[$user_id] = array();
            
            $a = array('name' => $value['event']['actor']['name'],
                'startedAtTime' => date("H:i:s", makeIsoDate($value['event']['generated']['startedAtTime'])),
                'endedAtTime' => date("H:i:s", makeIsoDate($val['event']['object']['endedAtTime'])));
            
            if(!empty($a['startedAtTime']) && !empty($a['endedAtTime'])){
                $a['diff'] = round(abs(strtotime($a['endedAtTime']) - strtotime($a['startedAtTime'])) / 60, 1);
            }
            
            $d = date('d M\'y', makeIsoDate($value['event']['generated']['startedAtTime']));
//            $d = gmdate("d/m/Y", makeIsoDate($value['event']['generated']['startedAtTime']));
            
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
//prePrint($result);

$outputs = array();
foreach($result as $ukey=>$user){
    ksort($user);
    $outputs[$ukey]['cates'] = array_keys($user);
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
?> 
<div class="form-group col-lg-2 pull-right">
    <label for="student-select">Select Students</label>
    <select id="student-select" name="user_id" onchange="pick_student(this);" class="form-control">
        <?php foreach($user_list as $uKey=>$uValue){ ?>
            <option value="<?php echo $uKey; ?>"><?php echo $uValue; ?></option>
        <?php } ?>
    </select>
</div>

<script type="text/javascript">
    var rawData = JSON.parse('<?php echo json_encode($ar); ?>');
    var fKey = '<?php echo reset(array_keys($user_list)); ?>';
    
    $(document).ready(function () {
        drawGraphs('student-session', rawData);
    });
    
    function pick_student(objthis){
        var fKey = objthis.value;
//        var jsonData = rawData[objthis.value];
        drawGraphs('student-session', rawData);
    }
</script>
<script type="text/javascript" src="graphjs/grapgh.js"></script>