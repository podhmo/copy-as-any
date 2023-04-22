// see: https://github.com/yorkxin/copy-as-markdown

const COLOR_GREEN = '#738a05';
const COLOR_RED = '#d11b24';
const COLOR_OPAQUE = [0, 0, 0, 255];

const TEXT_OK = '✓';
const TEXT_ERROR = '×';
const TEXT_EMPTY = '';

const FLASH_BADGE_TIMEOUT = 3000; // ms

export async function flashBadge(type) {
  const entrypoint = chrome.action /* MV3 */ || chrome.browserAction; /* Firefox MV2 */

  switch (type) {
    case 'success':
      await entrypoint.setBadgeText({ text: TEXT_OK });
      await entrypoint.setBadgeBackgroundColor({ color: COLOR_GREEN });
      break;
    case 'fail':
      await entrypoint.setBadgeText({ text: TEXT_ERROR });
      await entrypoint.setBadgeBackgroundColor({ color: COLOR_RED });
      break;
    default:
      return; // don't know what it is. quit.
  }

  chrome.alarms.create('clear', { when: Date.now() + FLASH_BADGE_TIMEOUT });
}

// TODO: setup function
chrome.alarms.onAlarm.addListener((alarm) => {
    const entrypoint = chrome.action /* MV3 */ || chrome.browserAction; /* Firefox MV2 */
  
    if (alarm.name === 'clear') {
      Promise.all([
        entrypoint.setBadgeText({ text: TEXT_EMPTY }),
        entrypoint.setBadgeBackgroundColor({ color: COLOR_OPAQUE }),
      ])
        .then(() => { /* NOP */ });
    }
  });