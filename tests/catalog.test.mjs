import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
test('approved Wellness offerings have a maintained source',()=>assert.ok(existsSync('frontend/data/wellness.json'),'Wellness structured catalog must be implemented'));
