<?php
include_once '../Events.php';

$event = new Events(1, 1000, 'Completed');
$res = $event->makeCurl();

//$final_res = array('0' => array('name' => 'All Results', 'dt' => array()));
$final_res = array();
$result = array();
if (!empty($res['content'])) {
    foreach ($res['content'] as $key => $value) {
        if (!empty($value['event']['generated']['extensions']['response'])) {
            if ($value['event']['generated']['extensions']['response'] == '1') {
                $quizz_id = end(explode('?id=', $value['event']['generated']['assignable']['isPartOf']['@id']));
                
//                prePrint($value['event']['generated']['assignable']);
                $ques_id = end(explode('?', $value['event']['generated']['assignable']['@id']));
                
                if (!empty($final_res[$quizz_id]['dt'][$ques_id])) {
                    array_push($final_res[$quizz_id]['dt'][$ques_id]['data'], $value['event']['generated']['attempt']['count']);
                } else {
                    $final_res[$quizz_id]['name'] = $value['event']['generated']['assignable']['isPartOf']['name'];
                    $final_res[$quizz_id]['dt'][$ques_id] = array('name' => 'Question ' . $ques_id, 'data' => array($value['event']['generated']['attempt']['count']));
                }
                
//                if (!empty($final_res['0']['dt'][$ques_id])) {
//                    array_push($final_res['0']['dt'][$ques_id]['data'], $value['event']['generated']['attempt']['count']);
//                } else {
//                    $final_res['0']['dt'][$ques_id] = array('name' => 'Question ' . $ques_id, 'data' => array($value['event']['generated']['attempt']['count']));
//                }
            }
        }
    }
    foreach ($final_res as $k=>$result){
        foreach ($result['dt'] as $key=>$value){
            $final_res[$k]['dt'][$key]['y'] = round(array_sum($value['data']) / count($value['data']), 2);
            unset($final_res[$k]['dt'][$key]['data']);
        }
        $final_res[$k]['dt'] = array_values($final_res[$k]['dt']);
    }
    
    $ar = array('title' => 'Question Complexity Per Quiz',
        'vtitle' => 'Complexity',
        'htitle' => 'Questions',
        'fKey' => reset(array_keys($final_res)),
        'datas' => $final_res);
    
    echo json_encode($ar);
    exit;
}