import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const data = JSON.parse(readFileSync(new URL('../frontend/data/wellness.json', import.meta.url)));
const byId = new Map(data.map(o => [o.id, o]));
const value = o => o.inclusions.reduce((sum, i) => sum + byId.get(i.id).price * i.quantity, 0);
test('wellness has authoritative identities, numeric prices and no invented durations', () => {
  assert.equal(byId.size, data.length);
  assert.equal(data.filter(o => o.kind === 'treatment' && o.bookable !== false).length, 13);
  assert.equal(data.filter(o => o.kind === 'package').length, 5);
  assert.equal(data.filter(o => o.kind === 'membership').length, 3);
  for (const o of data) {
    assert.equal(o.area, 'wellness');
    assert.ok(['Restore', 'Relax', 'Contour', 'Renew'].includes(o.category));
    assert.equal(typeof o.price, 'number');
    assert.ok(o.price >= 0);
    assert.equal(o.duration, undefined);
    for (const i of o.inclusions ?? []) assert.ok(byId.has(i.id));
  }
  const treatmentPrices = { 'pain-relief':6500, lymphatic:8000, relax:12000, detox:15500, elixir:18500, foot:4000, abdomen:5000, thigh:5000, arm:5000, hip:5000, 'fat-freezing':12000, sauna:2000, vibration:1500 };
  for (const [id, price] of Object.entries(treatmentPrices)) assert.equal(byId.get('wellness-' + id).price, price);
  assert.equal(byId.get('wellness-foot').price, 4000);
  assert.equal(byId.get('wellness-foot').providerLabel, 'Wellness therapist');
  assert.equal(byId.get('wellness-lymphatic').name, 'Lymphatic Drainage with Heat Massage');
  assert.equal(byId.get('wellness-fat-freezing').name, 'Fat Freezing — Cryolipolysis');
  assert.equal(byId.get('wellness-fat-freezing').maxPrice, 15000);
  assert.equal(byId.get('wellness-fat-freezing').price, 12000);
});
test('packages, memberships and contour totals retain supplied arithmetic', () => {
  const expected = {
    'quick-reset':[5000,5500], 'restore-ritual':[8900,10000], serenity:[12900,14000],
    'contour-starter':[8500,10000], 'elixir-signature':[19900,22000],
    'membership-essential':[9000,10000], 'membership-balance':[19500,22000],
    'membership-signature':[29000,32500], 'contour-4':[17000,20000], 'contour-6':[25500,30000]
  };
  for (const [id, [price, regular]] of Object.entries(expected)) {
    const offering=byId.get(id); assert.ok(offering, id); assert.equal(offering.price, price); assert.equal(value(offering), regular);
  }
  assert.equal(data.filter(o => /discovery|starter/i.test(o.name)).length, 1);
  assert.equal(byId.get('contour-starter').inclusions[0].quantity, 2);
  for (const id of ['contour-starter','contour-4','contour-6']) assert.equal(byId.get(id).inclusions[0].id, 'wellness-cavitation-area');
  assert.equal(byId.get('wellness-cavitation-area').bookable, false);
  assert.match(byId.get('contour-starter').description, /areas selected after assessment/i);
});
test('free assessment is independently selectable and pending techniques stay explicit', () => {
  const assessment = byId.get('wellness-assessment');
  assert.equal(assessment.kind, 'assessment'); assert.equal(assessment.price, 0);
  assert.equal(assessment.inclusions, undefined);
  for (const id of ['wellness-detox','wellness-elixir']) assert.match(byId.get(id).reviewNote, /technique.*pending/i);
});
