/*
 * @Author: annan shao 43042815+annanShao@users.noreply.github.com
 * @Date: 2022-05-10 19:35:45
 * @LastEditors: annan shao 43042815+annanShao@users.noreply.github.com
 * @LastEditTime: 2022-05-19 11:16:03
 * @FilePath: \te\mork.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const puppeteer = require('puppeteer');
process.setMaxListeners(0);

let allCount = 0;
let success = 0;
loop(allCount);

async function loop(count) {
  if (count >= 10000) {
    return;
  }
  (async (index) => {
    let targetChangeCnt = 0;
    const browser = await puppeteer.launch({
      headless: true, // 开启界面
    });
    browser.on('targetchanged', () => {
      targetChangeCnt++;
      if (targetChangeCnt === 2) {
        success++;
        browser.close();
      } else if (targetChangeCnt === 1) {
        setTimeout(() => {
          if (browser && browser.close) {
            browser.close();
          }
        }, 30000);
      }
    })
    const page = await browser.newPage();
    const url = 'https://f.wps.cn/w/EoROqOco/%20%E9%82%80%E4%BD%A0%E5%A1%AB%E5%86%99%E3%80%8CLantern%20Project%20?entrance=#write';
    await page.goto(url, {timeout: 0});
    console.log(`开始第${index}次投票`);
    let cnt = 1;
    let flag = false;
    page.on('request', () => {
      if (cnt++ >= 66 && !flag) {
        flag = true;
        page.removeAllListeners();
        page.addScriptTag({
          content: `
          console.log('inject');
          window.flagg = [false, false];
          window.iddd = ${count};
          const voteTexts = ['只此青绿【CV平台】【可触的世界】', 'INFINITE BOX【DCL/MD平台】【可触的世界】'];

          await new Promise(res => {
            [...document.querySelectorAll('.option_2nsiA')].filter(item => {
              return voteTexts.includes(item.innerText)
            }).map(it => it.parentElement.previousSibling).forEach((obj, index) => {
              console.log(obj);
              if (!window.flagg[index]) {
                obj.click();
              }
              window.flagg[index] = true;
              index && res();
            })
          })
          document.querySelectorAll('img').forEach(item => {
            item.remove();
          })

          const submit1 = document.getElementsByClassName('src-base-components-pc-button-index__button src-base-components-pc-button-index__confirm')[0];

          submit1.click();

          const submit2 = document.getElementsByClassName('src-base-components-pc-button-index__button src-base-components-pc-button-index__confirm')[1];

          if (submit2.click) {
            submit2.click();
          }
          `,
          type: 'module'
        }).finally(() => {
          allCount++;
          console.log(`-----------------------  总投票数：${allCount},投票成功数：${success}  -------------------------------`);
        })
      }
    });
  })(count);

  await sleep(8000);
  loop(count + 1);
}

function sleep(timeout) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout)
  })
}