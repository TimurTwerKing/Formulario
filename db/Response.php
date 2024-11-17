<?php
class Response
{
    private $success;
    private $message;
    private $data;

    public function __construct($success, $message, $data = null)
    {
        $this->success = $success;
        $this->message = $message;
        $this->data = $data;
    }

    public function toJson()
    {
        return json_encode([
            'success' => $this->success,
            'message' => $this->message,
            'data' => $this->data
        ]);
    }
}