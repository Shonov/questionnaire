<?php
/**
 * Created by PhpStorm.
 * User: Виталий Шонов
 * Date: 20.03.2019
 * Time: 22:05
 */

//https://docs.google.com/forms/d/e/1FAIpQLSdrk-y1LeUfPU8knzNxTPEG9_HVhSNoOFFK7yDDY9JasU9eCw/viewform
//https://docs.google.com/forms/d/e/1FAIpQLSccyfXTiJtIFCJKcguoYHYaI1GKPiYQtI30hBK2L7xmKRx4KQ/viewform

header('Access-Control-Allow-Origin: *');

if (!isset($_POST)) {
    die();
}

/**
 * @param array $fields - fields name (entry. ...)
 * @param $source - it's array higher
 * @param $post - %_POST data
 * @return mixed
 */
function getOtherFields(array $fields, $source, $post) {
    foreach($fields as $field => $key) {
        if ($field === 'entry.136769077' || $field === 'trial-tenth-text') {
            if (isset($post[$key])) {
                $source[$field] = [
                    '.other_option_response' => $post[$key],
                    '' => '__other_option__'
                ];
            }
            continue;
        }

        if ($source[$field] !== null && is_array($source[$field])) {
            $value = $source[$field];
            $source[$field] = array_merge($value, ['.other_option_response' => $post[$key], '' => '__other_option__']);
        } else if (isset($post[$key])) {
            $source[$field] = [
                '.other_option_response' => $post[$key],
                '' => '__other_option__'
            ];
        }
    }
    return $source;
}

$post = $_POST;
$type = $post['type'];

$forms = [
    'membership' => [
        'url' => 'https://docs.google.com/forms/d/e/1FAIpQLSccyfXTiJtIFCJKcguoYHYaI1GKPiYQtI30hBK2L7xmKRx4KQ/formResponse',
        'ids' => array_diff([
            'entry.193590776' => $post['first-question'],
            'entry.1451870076' => $post['second-question'],
            'entry.1266740912' => $post['text-field-third-question'],
            'entry.420448521' => $post['third-question'],
            'entry.1057765330' => $post['fourth-question'],
            'entry.136769077' => $post ['fifth-question'],
            'entry.1841868503' => $post['sixth-question'],
            'entry.955758598' => $post['seventh-question'],
        ], array('')),
    ],

    'trial' => [
        'url' => 'https://docs.google.com/forms/d/e/1FAIpQLSdrk-y1LeUfPU8knzNxTPEG9_HVhSNoOFFK7yDDY9JasU9eCw/formResponse',
        'ids' => array_diff([
            'entry.1330124781' => $post['trial-first-question'], //
            'entry.1976097942' => $post['trial-second-question'],
            'entry.418412210' => $post['trial-third-question'], //
            'entry.1488254072' => $post['trial-fourth-question'],
            'entry.193590776' => $post['trial-fifth-question'], //
            'entry.1451870076' => $post ['trial-sixth-question'], //
            'entry.1266740912' => $post['trial-seventh-question'],
            'entry.420448521' => $post['trial-eighth-question'],
            'entry.1057765330' => $post['trial-ninth-question'], //
            'entry.136769077' => $post['trial-tenth-question'], //
            'entry.1841868503' => $post['trial-eleventh-question'],
            'entry.955758598' => $post['trial-twelve-question'],
        ], array('')),
    ],
];
$otherFields = [
    'membership' => [
        'entry.193590776' => 'text-field-first-question',
        'entry.1451870076' => 'text-field-second-question',
        'entry.136769077' => 'fifth-other-question',
    ],

    'trial' => [
        'entry.1330124781' => 'trial-first-text',
        'entry.418412210' => 'trial-third-text',
        'entry.193590776' => 'trial-fifth-text',
        'entry.1451870076' => 'trial-sixth-text',
        'entry.136769077' => 'trial-tenth-text',
    ],
];

$ids = getOtherFields($otherFields[$type], $forms[$type]['ids'], $post);
$test = http_build_query($ids);

foreach ($ids as $key => $value) {
    if (substr_count($test, $key) >= 1) {
        for ($i = 0, $iMax = substr_count($test, $key); $i < $iMax; $i++) {
            $test = str_replace([$key . '%5B' . $i . '%5D', '%27%5D', '%5B%27'], [$key, '', ''], $test);
        }
    }
}
$test = str_replace(['%5D', '%5B'], '', $test);

$url = $forms[$type]['url'];

$options = array(
    'http' => array(
        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
        'method' => 'POST',
        'content' => $test,
    ),
);

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if (!$result) {
    $response['error'] = true;
    die(json_encode($response));
}

$response['error'] = false;
die(json_encode($response));
