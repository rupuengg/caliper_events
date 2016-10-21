<?php
include_once 'Events.php';

$draw = isset($_REQUEST['draw']) ? $_REQUEST['draw'] : 1;

if(!empty($_REQUEST['columns'][$_REQUEST['order'][0]['column']]['data']) && $draw != 1){
    $c = $_REQUEST['columns'][$_REQUEST['order'][0]['column']]['data'];
    switch($c){
        case 'profile':
            $c = 'event.@type';
        break;
        case 'action':
            $c = 'event.action';
        break;
        case 'actor':
            $c = 'event.actor.name';
        break;
        case 'event_time':
            $c = 'event.eventTime';
        break;
    }
}else{
    $c = 'event.eventTime';
}

$d = !empty($_REQUEST['order'][0]['dir']) ? $_REQUEST['order'][0]['dir'] : 'asc';

$start = isset($_REQUEST['start']) ? $_REQUEST['start'] : 1;
$limit = 10;

$event = new Events($start, $limit, '', $c, $d);
$res = $event->makeCurl();

$all_events = array('data' => array(),
    'draw' => $draw, 
    'recordsTotal' => $res['content_detail']['totalElements'], 
    'recordsFiltered' => $res['content_detail']['totalElements']);

if ($res) {
    foreach ($res['content'] as $key => $value) {
        $a = array('profile' => end(explode('/', $value['event']['@type'])),
            'action' => end(explode('#', $value['event']['action'])),
            'actor' => $value['event']['actor']['name'] . ' (' . end(explode('/', $value['event']['actor']['@id'])) . ')',
            'event_time' => date("Y-m-d H:i:s", str_replace('000', '', $value['event']['eventTime'])),
            'full' => "<textarea style='display:none;'>" . json_encode($value) . "</textarea>"
            . "<a class='js-open-modal other' href='javascript:;' data-modal-id='popup1'>View JSON</a>");
        array_push($all_events['data'], $a);
    }
    echo json_encode($all_events);
}