import test from 'ava';
import appManager from '../';

/**
 * RUNNINGAPPLICATIONS TESTS
 */

test('runningApplications promise', async t => {
  const res = await appManager.runningApplications()
  t.true(res instanceof Array);
});

test.cb('runningApplications callback', t => {
  appManager.runningApplications(undefined, t.end);
});

test('runningApplications args', async t => {
  t.throws(await appManager.runningApplications([]), Error);
  t.throws(() => appManager.runningApplications({}, 'string'), Error);
});

/**
 * ISOPEN TESTS
 */

test('isOpen promise', async t => {
  const res = await appManager.isOpen('');
  t.true(typeof res === 'boolean'); 
});

test('isOpen args', async t => {
  t.throws(await appManager.isOpen([]), Error);
  t.throws(() => appManager.isOpen({}, 'string'), Error);
});

test.cb('isOpen callback', t => {
  appManager.isOpen('', t.end);
});

/**
 * QUIT TESTS
 */

test('quit promise', async t => {
  const res = await appManager.quit('');
  t.true(res === undefined);
});

test.cb('quit callback', t => {
  appManager.quit('', t.end);
});

test('quit args', async t => {
  t.throws(await appManager.quit([]), Error);
  t.throws(() => appManager.quit({}, 'string'), Error);
});

/**
 * MINIMIZE TESTS
 */

test('minimize promise', async t => {
  const res = await appManager.minimize('Terminal');
  t.true(res === undefined);
});

test.cb('minimize callback', t => {
  appManager.quit('', t.end);
});

//This test has to run first. If breaks runningApplications function otherwise.
test.serial('minimize args', async t => {
  t.throws(await appManager.minimize([]), Error);
  t.throws(() => appManager.minimize('app', {all: false}, {}), Error);
});

/**
 * FOCUS TESTS
 */

test('focus promise', async t => {
  const res = await appManager.focus('Terminal');
  t.true(res === undefined);
});

test.cb('focus callback', t => {
  appManager.focus('Terminal', t.end);
});

test('focus args', async t => {
  t.throws(await appManager.focus([]), Error);
  t.throws(() => appManager.focus({}, 'string'), Error);
});