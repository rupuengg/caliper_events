<?php

class Events {

    private $page;
    private $limit;
    private $action;
    private $col;
    private $dir;
    private $payload = array();

    public function __construct($page, $limit, $action = '', $col='', $dir='') {
        $this->page = $page;
        $this->limit = $limit;
        $this->action = $action;
        $this->col = $col;
        $this->dir = $dir;
    }

    public function makeCurl() {
        $headers = [
            'Content-Type' => 'application/json',
            'Authorization' => 'Basic Y2FsaXBlcmV2ZW50c3RvcmU6Y2FsaXBlcmV2ZW50c3RvcmU=',
        ];

//        $client = curl_init("http://10.0.29.25:8080/v1/caliper/event?action=$this->action&page=$this->page&limit=$this->limit");
        $client = curl_init("http://10.0.29.25:9200/calipereventstore_event/_search");
        $headerStrings = [];
        foreach ($headers as $headerKey => $headerValue) {
            $headerStrings[] = $headerKey . ': ' . $headerValue;
        }

        $this->makePayload();

        curl_setopt_array($client, [
            CURLOPT_POST => false,
            CURLOPT_TIMEOUT_MS => 10000,
            CURLOPT_HTTPHEADER => $headerStrings,
            CURLOPT_USERAGENT => 'Caliper (PHP curl extension)',
            CURLOPT_HEADER => true, // CURLOPT_HEADER required to return response text
            CURLOPT_RETURNTRANSFER => true, // CURLOPT_RETURNTRANSFER required to return response text
            CURLOPT_POSTFIELDS => json_encode($this->payload), // CURLOPT_RETURNTRANSFER required to return response text
        ]);

        $responseText = curl_exec($client);
        $responseInfo = curl_getinfo($client);
        $header_size = curl_getinfo($client, CURLINFO_HEADER_SIZE);
        curl_close($client);

        if ($responseText) {
            $body = null;
            $body = json_decode(substr($responseText, $header_size), true);
            $responseCode = $responseInfo['http_code'];
        } else {
            $responseCode = null;
        }

        $res = array('content' => array());
        foreach ($body['hits']['hits'] as $key => $value) {
            array_push($res['content'], $value['_source']);
        }
        $res['content_detail']['totalElements'] = $body['hits']['total'];
        
        if ($body['hits']['total'] % 10 == 0)
            $res['content_detail']['totalPages'] = $body['hits']['total'] / 10;
        else
            $res['content_detail']['totalPages'] = round($body['hits']['total'] / 10) + 1;
        
        return $res;
    }

    public function makePayload() {
        if (!empty($this->action)) {
            $this->payload = array("query" => array("match" => array("event.action" => $this->action)));
        }
        
        if (!empty($this->limit)) {
            $this->payload['size'] = $this->limit;
        }
        
        if (isset($this->page)) {
            $this->payload['from'] = $this->page;//($this->page - 1) * $this->limit;
        }
        
        if (!empty($this->col)) {
            $this->payload["sort"] = array($this->col => array("order" => ($this->dir == 'asc') ? 'desc' : 'asc'));
        }
    }

}

function makeIsoDate($timestamp=''){
    return substr($timestamp, 0, -3);
}

function getStartAndEndDate($week, $year) {
    $time = strtotime("1 January $year", time());
    $day = date('w', $time);
    $time += ((7 * $week) + 1 - $day) * 24 * 3600;
    $return[0] = date('Y-n-j', $time);
    $time += 6 * 24 * 3600;
    $return[1] = date('Y-n-j', $time);
    return $return;
}

function prePrint($ar = null, $isDie = true) {
    echo '<pre>';
    print_r($ar);
    if ($isDie)
        die;
    else
        echo '<pre>';
}