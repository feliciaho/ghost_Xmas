let Api = "get_setting.php";
let user = $(".acc_id").attr("data-acc");
// 登出的方程式
function logout_dg() {
  $("#logout-form").submit();
}

// 登入api
login();
function login() {
  $.post(
    Api,
    {
      type: "login",
      user: user,
    },
    function (res) {
      if (res.status == -99) {
        // 未登錄
        $(".refreshBtn ,.startBtn1 ,.startBtn10").on("click", function () {
          $(".mask1 , .pop_wrap2").fadeIn(200);
          $(".pop_box2").html(login_digeam.content);
        });
      } else if (res.status == -90) {
        // 活動已結束
        $(".refreshBtn ,.startBtn1 ,.startBtn10").on("click", function () {
          $(".mask1 , .pop_wrap2").fadeIn(200);
          $(".pop_box2").html(end.content);
        });
      } else if (res.status == 1) {
        // 是否消耗69點轉一次
        $(".startBtn1 ").on("click", function () {
          let approve = $(".approve_box").attr("data-approve");
          if (approve == "true") {
            lottery_func(1);
          } else {
            $(".mask1 , .pop_wrap2").fadeIn(200);
            $(".pop_box2").html(point69.content);
            // 確認消耗點數抽取按鈕
            $("pop_confirm 1").on("click", function () {
              lottery_func($(this).data("num"));
            });
          }
        });
        // 是否消耗695點轉十次
        $(".startBtn10 ").on("click", function () {
          let approve = $(".approve_box").attr("data-approve");
          if (approve == "true") {
            lottery_func(10);
          } else {
            $(".mask1 , .pop_wrap2").fadeIn(200);
            $(".pop_box2").html(point695.content);
            // 確認消耗點數抽取按鈕
            $("pop_confirm 10").on("click", function () {
              lottery_func($(this).data("num"));
            });
          }
        });
        // 是否消耗10點刷新
        $(".refreshBtn ").on("click", function () {
          let approve = $(".approve_box").attr("data-approve");
          if (approve == "true") {
            // 刷新function
            refresh();
          } else {
            $(".mask1 , .pop_wrap2").fadeIn(200);
            $(".pop_box2").html(point10.content);
          }
        });
        // 聖誕襪>0的時候要發光,是否持有聖誕襪
        if (res.socks > 0) {
          $(".sockBtn").addClass("active");
          $(".sockBtn").on("click", function () {
            lottery_func(0);
          });
        } else {
          $(".sockBtn").on("click", function () {
            $(".mask1 , .pop_wrap2").fadeIn(200);
            $(".pop_box2").html(socksNo.content);
            // 確認消耗點數抽取按鈕
            $(".pop_confirm 0").on("click", function () {
              lottery_func($(this).data("num"));
            });
          });
        }
        // 點數之類的數字顯示
        $(".point").html(res.point);
        $(".lotteryAmount").html(res.amount);
        $(".sockAmount").html(res.socks);
        $(".refreshAmount").html(res.refresh);
        // 轉盤獎池的獎品
        for (let i = 0; i < res.lotteryList.length; i++) {
          let itemName = res.lotteryList[i].item_name;
          let itemImage = res.lotteryList[i].img;
          let itemId = res.lotteryList[i].id;
          $('.square[data-order="' + i + '"]').html(
            `<div class="lottery_box" data-id="${itemId}">
                <img src="/event/20231220/img/icon/${itemImage}.jpg" >
                <p>${itemName}</p>
              </div>`
          );
        }
      }
    },
    "json"
  );
}

// 抽獎api
function lottery_func(_num) {
  $(".mask2").show();
  $.post(
    Api,
    {
      type: "lottery",
      user: user,
      num: _num,
    },
    function (res) {
      $(".mask2").hide();
      if (res.status == -98) {
        $(".mask1 , .pop_wrap2").fadeIn(200);
        $(".pop_box2").html(pointNo.content);
      } else if (res.status == -97) {
        $(".mask1 , .pop_wrap2").fadeIn(200);
        $(".pop_box2").html(socksNo.content);
      } else if (res.status == 1) {
        if (_num == 0) {
          // 如果是聖誕襪直接顯示獎品;
          let loStr = "";
          res.result.forEach((i) => {
            loStr += `
        <div class="icon_box" >
        <img src="/event/20231220/img/icon/${i.img}.jpg" alt="">
        <p>${i.item_name}</p>
        </div>`;
          });
          $(".mask0 , .pop_wrap1").fadeIn(200);
          $(".pop_box").html(consequence.title + consequence.content);
          $(".icon_list").html(loStr);
        } else {
          // 轉一次轉十次
          let approve = $(".approve_box").attr("data-approve");
          // 不略過動畫
          if (approve == "false") {
            // 動畫轉轉開始
            init();
            // 指向獎品的位置
            let itemPlace = res.result[0].id;
            prize = $('.lottery_box[data-id="' + itemPlace + '"]')
              .parent(".square")
              .data("order");
            setTimeout(show1, 3000);
            function show1() {
              $(".mask2").hide();
              // 獎品列表產出
              let loStr1 = "";
              res.result.forEach((i) => {
                loStr1 += `
                 <div class="icon_box" data-id="${i.id}" >
                  <img src="/event/20231220/img/icon/${i.img}.jpg" alt="">
                 <p>${i.item_name}</p>
                 </div>`;
              });
              // 判斷是否有抽到金獎需要重整與否
              if (res.gold == 1) {
                $(".mask0 , .pop_wrap1").fadeIn(500);
                $(".pop_box").html(consequenceG.title + consequenceG.content);
                $(".icon_list").html(loStr1);
                // 新增金獎樣式
                res.result.forEach((i) => {
                  if (i.cate === "金雪球") {
                    $(`.icon_box[data-id="${i.id}"]`).addClass("active");
                  }
                });
              } else {
                $(".mask0 , .pop_wrap1").fadeIn(500);
                $(".pop_box").html(consequence.title + consequence.content);
                $(".icon_list").html(loStr1);
              }
            }
          } else {
            // 指向獎品的位置
            let itemPlace = res.result[0].id;
            prize = $('.lottery_box[data-id="' + itemPlace + '"]')
              .parent(".square")
              .data("order");
            let loStr1 = "";
            res.result.forEach((i) => {
              loStr1 += `
              <div class="icon_box" data-id="${i.id}">
              <img src="/event/20231220/img/icon/${i.img}.jpg" alt="">
              <p>${i.item_name}</p>
               </div>`;
            });
            // 判斷是否有抽到金獎需要重整與否
            if (res.gold == 1) {
              $(".mask0 , .pop_wrap1").fadeIn(500);
              $(".pop_box").html(consequenceG.title + consequenceG.content);
              $(".icon_list").html(loStr1);
              // 新增金獎樣式
              res.result.forEach((i) => {
                if (i.cate === "金雪球") {
                  $(`.icon_box[data-id="${i.id}"]`).addClass("active");
                }
              });
            } else {
              $(".mask0 , .pop_wrap1").fadeIn(500);
              $(".pop_box").html(consequence.title + consequence.content);
              $(".icon_list").html(loStr1);
            }
          }
        }
      }
    },
    "json"
  );
}

// 刷新api
function refresh() {
  $(".mask2").show();
  $.post(
    Api,
    {
      type: "refresh",
      user: user,
    },
    function (res) {
      if (res.status == -98) {
        $(".mask2").hide();
        $(".mask1 , .pop_wrap2").fadeIn(200);
        $(".pop_box2").html(pointNo.content);
      } else if (res.status == 1) {
        window.location.reload();
      }
    },
    "json"
  );
}

// 轉轉樂活動紀錄
function lotteryHistory() {
  $.post(
    Api,
    {
      type: "lotteryHistory",
      user: user,
    },
    function (res) {
      if (res.status == 1) {
        let str = "";
        let sendStr = "";
        res.lotHistory_list.forEach((i) => {
          // 判斷是否領取
          if (i.is_send == "Y") {
            sendStr = `<td width="1%" class="claimYes" >已領取</th>`;
          } else if (i.is_send == "N") {
            sendStr = `<td width="1%" class="claimNo" onclick="lotteryClaim(${i.id})">未領取</th>`;
          }
          // 活動紀錄列表
          str += `<tr>
                  <td width="3%"><div class="list1"><img src="/event/20231220/img/icon/${i.img}.jpg">${i.item_name}</div></th>
                  <td width="1%">${i.count}</th>
                  ${sendStr}
              </tr>`;
        });
        $(".mask , .pop_wrap1").fadeIn(200);
        $(".pop_box").html(loHistory.title + loHistory.content);
        $(".listClaim").html(str);
      }
    },
    "json"
  );
}

// 回饋刷新活動紀錄
function refreshHistory() {
  $.post(
    Api,
    {
      type: "refreshHistory",
      user: user,
    },
    function (res) {
      if (res.status == 1) {
        let str = "";
        let str_claim = "";
        // let list_order = res.lotHistory_list[i];
        // console.log(list_order);
        res.lotHistory_list.forEach((i, index) => {
          if (i.used == 0 && i.remaining == 0) {
            str_claim = `<td width="1.25%" class="claimYes2">領取完畢</td>`;
          } else if (i.used == 0 && i.remaining > 0) {
            str_claim = `<td width="1.25%" class="claimYes">無法領取</td>`;
          } else if (i.used > 0 && i.remaining > 0) {
            str_claim = `<td width="1.25%" onclick="refreshClaim(${index})" class="claimNo">領取</td>`;
          }
          str += `
        <tr>
          <td width="2%"><div class="list1"><img src="/event/20231220/img/icon/${i.img}.jpg">${i.item_name}</div></td>
          <td width="0.5%">${i.count}</td>
          <td width="1.25%">${i.used}</td>
          <td width="1.0%">${i.remaining}</td>
          ${str_claim}
        </tr>`;
          $(".listClaim2").html(str);
        });
      }
    },
    "json"
  );
}
//轉轉樂領取確認
function lotteryClaim(_id) {
  $(".mask2").show();
  $.post(
    Api,
    {
      type: "lotteryClaim",
      user: user,
      id: _id,
    },
    function (res) {
      setTimeout(function(){$(".mask2").hide()} ,1500);
      if (res.status == 1) {
        $(".mask1 , .pop_wrap2").fadeIn(200);
        $(".pop_box2").html(successClaim.content);
      }
    },
    "json"
  );
}
//刷新回饋領取確認
function refreshClaim(_id) {
  $(".mask2").show();
  $.post(
    Api,
    {
      type: "refreshClaim",
      user: user,
      id: _id,
    },
    function (res) {
      setTimeout(function(){$(".mask2").hide()} ,1500);
      if (res.status == -99) {
        $(".mask1 , .pop_wrap2").fadeIn(200);
        $(".pop_box2").html(amountNo.content);
      } else if (res.status == 1) {
        $(".mask1 , .pop_wrap2").fadeIn(200);
        $(".pop_box2").html(successClaim.content);
      }
    },
    "json"
  );
}
