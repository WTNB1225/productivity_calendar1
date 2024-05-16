import  { useState, useEffect } from "react";
import "./Calendar.css"
import useCheckLoginStatus from "../../hooks/useCheckLoginStatus";
function Calendar() {
  const weeks = ['日', '月', '火', '水', '木', '金', '土'];
  const [username, setUsername] = useState(''); // ユーザー名
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [calendarHtml, setCalendarHtml] = useState('');

  Promise.resolve(useCheckLoginStatus()).then((response) => {
    setUsername(response.user.username);
  });

  useEffect(() => {
    let ignore = false;
    if(!ignore) {
      showCalendar(year, month);
    }
    return(() => {ignore = true;});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, username]);

  function showCalendar(year: number, month: number) {
    const date = new Date(year, month - 1, 1); // 月の最初の日を取得
    const endDate = new Date(year, month, 0); // 月の最後の日を取得
    const endDayCount = endDate.getDate(); // 月の末日
    const startDay = date.getDay(); // 月の最初の日の曜日を取得
    const lastMonthEndDate = new Date(year, month - 1, 0); // 前月の最後の日
    const lastMonthendDayCount = lastMonthEndDate.getDate(); // 前月の末日
    let dayCount = 1; // 日にちのカウント
    let html = ''; // カレンダーのHTMLを格納する変数

    html += '<h1>' + username + 'のカレンダー</h1>';
    html += '<h1>' + year  + '/' + month + '</h1>'
    html += '<table border="1" style="border-collapse: collapse">';

    for(let i = 0; i < weeks.length; i++) {
      html += '<td>' + weeks[i] + '</td>';
    }

    for(let w = 0; w < 6; w++) {
      html += '<tr>';

      for(let d = 0; d < 7; d++) {
        if (w === 0 && d < startDay) {
          // 1行目で1日の曜日の前
          const num = lastMonthendDayCount - startDay + d + 1
          html += `<td class="disabled day">` + num + '</td>'
        } else if (dayCount > endDayCount) {
          //末尾の日数を超えた
          const num = dayCount - endDayCount
          html += '<td class="disabled day">' + num + '</td>'
          dayCount++
        } else {
          html += `<td class="day" id=${year}-${month}-${dayCount}>` + dayCount + '</td>';
          dayCount++;
        }
      }

      html += '</tr>';
    }

    html += '</table>';
    setCalendarHtml(html);
  }

  const handleNextClick = () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  }

  const handlePreviousClick = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  }

  return(
    <div>
      <div>
        <button onClick={handlePreviousClick}>先月</button>
        <button onClick={handleNextClick}>来月</button>
      </div>
      <div dangerouslySetInnerHTML={{__html: calendarHtml}}></div>
    </div>
  )
}

export default Calendar;