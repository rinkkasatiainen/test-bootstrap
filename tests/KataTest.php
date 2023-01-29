<?php

namespace Tests;

use PHPUnit\Framework\TestCase;
use kata\Something;

require __DIR__ . '/../vendor/autoload.php';

class KataTest extends TestCase
{
    public function testDummy()
    {
        $kata = new Something();
        $this->assertEquals($kata->foo(), 2);
    }

    public function testNotFailing()
    {
        $this->assertTrue(true);
    }

}
