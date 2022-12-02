//============================== 참고 자료 ==============================//
//https://nomadcoders.co/ - > 코코아톡 클론 코딩, 바닐라 js로 크롬앱 만들기
//============================== 캘린더 변수==============================//
const date = new Date();

const nowMonth = date.getMonth();
const nowYear = date.getFullYear();
const nowDate = date.getDate();
const getMonth = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const getDayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
const calendarTitle = document.querySelector(
    ".calendar__title span:nth-child(2)"
);
const leftChevron = document.querySelector(".calendar__title span:first-child");
const rightChevron = document.querySelector(".calendar__title span:last-child");
const calendarDay = document.querySelector(".calendar__day");
const calendarLoadingIcon = document.querySelector(".calendar__loading");
const todosTitle = document.querySelector(".todos__title");

let year = nowYear;
let month = nowMonth;
let dateOfMonth = nowDate;
let apiLoading = false;
let extractedHolidays = [];

const todosInput = document.querySelector(".todos__input");
const todosForm = document.querySelector(".todos__form");

const todayKey = `D${nowYear}${String(nowMonth + 1).padStart(2, "0")}${String(
    nowDate
).padStart(2, "0")}`;
let localStorageItemName = todayKey;
leftChevron.addEventListener("click", clickBeforeMonth);
rightChevron.addEventListener("click", clickNextMonth);
todosForm.addEventListener("submit", addTodoItem);

initCalendar();

async function initCalendar() {
    await printDay(nowYear, nowMonth);
    document
        .querySelector(
            `#D${nowYear}${nowMonth + 1}${String(nowDate).padStart(2, "0")}`
        )
        .classList.add("calendar__day-item--clicked");
    printTodos(localStorageItemName);
}

async function findHolidaysFromLocal(targetYear) {
    apiLoading = true;
    if (localStorage.getItem("H" + targetYear) == null) {
        await createHolidaysToLocalStorage(targetYear);
        console.log("api요청완료");
    }
    apiLoading = false;
}

async function createHolidaysToLocalStorage(year) {
    let apiLoop = true;
    let test = [];
    while (apiLoop) {
        await Promise.all([
            fetch(
                "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=ekC4oLj9HiRR136lGjdLiiNDOzqPEKSYXbumkXqOxtHTCnA1pxSmHbI4FacDWPcwui2XiEme6dl9UJT2Bva6fA%3D%3D&solYear=" +
                year +
                "&solMonth=01&_type=json"
            ).then((response) => response.json()),
            fetch(
                "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=ekC4oLj9HiRR136lGjdLiiNDOzqPEKSYXbumkXqOxtHTCnA1pxSmHbI4FacDWPcwui2XiEme6dl9UJT2Bva6fA%3D%3D&solYear=" +
                year +
                "&solMonth=02&_type=json"
            ).then((response) => response.json()),
            fetch(
                "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=ekC4oLj9HiRR136lGjdLiiNDOzqPEKSYXbumkXqOxtHTCnA1pxSmHbI4FacDWPcwui2XiEme6dl9UJT2Bva6fA%3D%3D&solYear=" +
                year +
                "&solMonth=03&_type=json"
            ).then((response) => response.json()),
            fetch(
                "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=ekC4oLj9HiRR136lGjdLiiNDOzqPEKSYXbumkXqOxtHTCnA1pxSmHbI4FacDWPcwui2XiEme6dl9UJT2Bva6fA%3D%3D&solYear=" +
                year +
                "&solMonth=04&_type=json"
            ).then((response) => response.json()),
            fetch(
                "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=ekC4oLj9HiRR136lGjdLiiNDOzqPEKSYXbumkXqOxtHTCnA1pxSmHbI4FacDWPcwui2XiEme6dl9UJT2Bva6fA%3D%3D&solYear=" +
                year +
                "&solMonth=05&_type=json"
            ).then((response) => response.json()),
            fetch(
                "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=ekC4oLj9HiRR136lGjdLiiNDOzqPEKSYXbumkXqOxtHTCnA1pxSmHbI4FacDWPcwui2XiEme6dl9UJT2Bva6fA%3D%3D&solYear=" +
                year +
                "&solMonth=06&_type=json"
            ).then((response) => response.json()),
            fetch(
                "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=ekC4oLj9HiRR136lGjdLiiNDOzqPEKSYXbumkXqOxtHTCnA1pxSmHbI4FacDWPcwui2XiEme6dl9UJT2Bva6fA%3D%3D&solYear=" +
                year +
                "&solMonth=07&_type=json"
            ).then((response) => response.json()),
            fetch(
                "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=ekC4oLj9HiRR136lGjdLiiNDOzqPEKSYXbumkXqOxtHTCnA1pxSmHbI4FacDWPcwui2XiEme6dl9UJT2Bva6fA%3D%3D&solYear=" +
                year +
                "&solMonth=08&_type=json"
            ).then((response) => response.json()),
            fetch(
                "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=ekC4oLj9HiRR136lGjdLiiNDOzqPEKSYXbumkXqOxtHTCnA1pxSmHbI4FacDWPcwui2XiEme6dl9UJT2Bva6fA%3D%3D&solYear=" +
                year +
                "&solMonth=09&_type=json"
            ).then((response) => response.json()),
            fetch(
                "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=ekC4oLj9HiRR136lGjdLiiNDOzqPEKSYXbumkXqOxtHTCnA1pxSmHbI4FacDWPcwui2XiEme6dl9UJT2Bva6fA%3D%3D&solYear=" +
                year +
                "&solMonth=10&_type=json"
            ).then((response) => response.json()),
            fetch(
                "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=ekC4oLj9HiRR136lGjdLiiNDOzqPEKSYXbumkXqOxtHTCnA1pxSmHbI4FacDWPcwui2XiEme6dl9UJT2Bva6fA%3D%3D&solYear=" +
                year +
                "&solMonth=11&_type=json"
            ).then((response) => response.json()),
            fetch(
                "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=ekC4oLj9HiRR136lGjdLiiNDOzqPEKSYXbumkXqOxtHTCnA1pxSmHbI4FacDWPcwui2XiEme6dl9UJT2Bva6fA%3D%3D&solYear=" +
                year +
                "&solMonth=12&_type=json"
            ).then((response) => response.json()),
        ]).then((data) => {
                let temp;
                for (let d of data) {
                    console.log(d);
                    if (d.response.body.totalCount > 1) {
                        test.push(d.response.body.items.item);
                    } else if (d.response.body.totalCount == 1) {
                        temp = [];
                        temp.push(d.response.body.items.item);
                        test.push(temp);
                    } else {
                        temp = [];
                        test.push(temp);
                    }
                }
                apiLoop = false;
                console.log(test);

                localStorage.setItem("H" + year, JSON.stringify(test));
            }
        ).catch(error => {
            apiLoop = confirm("api요청을 실패하였습니다. 다시 요청하시겠습니까?");
        });
    }
}


function createHolidaysArray(beforeYear, beforeMonth, year, month, nextYear, nextMonth) {
    let holidays = [];
    // 2021 2022 2022
    if (beforeYear < year && year == nextYear) {
        const beforeHolidays = JSON.parse(localStorage.getItem("H" + beforeYear));
        if (beforeHolidays[beforeMonth].length != 0) {
            for (d of beforeHolidays[beforeMonth]) {
                holidays.push(d);
            }
        }
        const nowHolidays = JSON.parse(localStorage.getItem("H" + year));
        if (nowHolidays[month].length != 0) {
            for (d of nowHolidays[month]) {
                holidays.push(d);
            }
        }
        if (nowHolidays[nextMonth].length != 0) {
            for (d of nowHolidays[nextMonth]) {
                holidays.push(d);
            }
        }
        return holidays;
    }
    // 2022 2022 2022
    if (beforeYear == year && year == nextYear) {
        const nowHolidays = JSON.parse(localStorage.getItem("H" + year));
        if (nowHolidays[beforeMonth].length != 0) {
            for (d of nowHolidays[beforeMonth]) {
                holidays.push(d);
            }
        }
        if (nowHolidays[month].length != 0) {
            for (d of nowHolidays[month]) {
                holidays.push(d);
            }
        }
        if (nowHolidays[nextMonth].length != 0) {
            for (d of nowHolidays[nextMonth]) {
                holidays.push(d);
            }
        }
        return holidays;
    }
    // 2022 2022 2023
    if (beforeYear == year && year < nextYear) {
        const nowHolidays = JSON.parse(localStorage.getItem("H" + year));
        if (nowHolidays[beforeMonth].length != 0) {
            for (d of nowHolidays[beforeMonth]) {
                holidays.push(d);
            }
        }
        if (nowHolidays[month].length != 0) {
            for (d of nowHolidays[month]) {
                holidays.push(d);
            }
        }
        const nextHolidays = JSON.parse(localStorage.getItem("H" + nextYear));
        if (nextHolidays[nextMonth].length != 0) {
            for (d of nextHolidays[nextMonth]) {
                holidays.push(d);
            }
        }
        return holidays;
    }
    return holidays;
}

async function openApiSpeedTest() {
    let nextYear = year;
    let befroeYear = year;
    let nextMonth = month + 1;
    let befroeMonth = month - 1;

    if (befroeMonth < 0) {
        lastMonth = 11;
        befroeYear = year - 1;
    }
    if (nextMonth > 11) {
        nextMonth = 0;
        nextYear = year + 1;
    }
    const nowSeconds = Date.now();
    console.log("실행1");
    await getHolidayFromOpenApi(befroeYear, befroeMonth);
    console.log("실행2");
    await getHolidayFromOpenApi(year, month);
    console.log("실행3");
    await getHolidayFromOpenApi(nextYear, nextMonth);
    console.log("종료");
    const afterSeconds = Date.now();
    const totalSeconds = String(
        (Number(afterSeconds) - Number(nowSeconds)) / 1000
    );
    console.log("걸린시간 : " + totalSeconds + "초");
}

//============================================================//
function deleteTodoItem(event) {
    if (confirm("일정을 삭제하시겠습니까?")) {
        let todos = JSON.parse(localStorage.getItem(localStorageItemName));
        const itemId = parseInt(event.target.parentElement.id);
        todos = todos.filter((t) => t.id !== itemId);
        localStorage.setItem(localStorageItemName, JSON.stringify(todos));
        if (todos.length == 0) {
            localStorage.removeItem(localStorageItemName);
            document
                .getElementById(localStorageItemName)
                .removeEventListener("mouseleave", dayItemMouseleave);
            document
                .getElementById(localStorageItemName)
                .removeEventListener("mouseover", dayItemMouseover);
            document
                .getElementById(localStorageItemName)
                .querySelector(".calendar__day-item-notification")
                .remove();
        }
        printTodos(localStorageItemName);
    }
}

function dayItemMouseover(event) {
    event.target.classList.add("calendar__day-item--hover");
    event.target.innerText = JSON.parse(
        localStorage.getItem(
            `D${event.target.id.substr(1, 4)}${event.target.id.substr(
                5,
                2
            )}${event.target.id.substr(7, 2)}`
        )
    ).length;
}

// notification을 가진 day를 Mouseleave할시에 작동하는 function
function dayItemMouseleave(event) {
    event.target.classList.remove("calendar__day-item--hover");
    event.target.innerText = `${event.target.id.substring(7, 9)}`;
    let addNotification = document.createElement("span");
    addNotification.classList.add("calendar__day-item-notification");
    event.target.appendChild(addNotification);
    document
        .querySelector(`#${event.target.id}`)
        .addEventListener("click", dayItemClick);
}

function dayItemClick(event) {
    //D 2022 11 10
    //calendar__day--clicked 효과 적용
    dateOfMonth = event.target.id.substring(
        event.target.id.length - 2,
        event.target.id.length
    );
    let days = document.querySelectorAll(".calendar__day-item");
    // for (let d = 0; d < days.length; d++) {
    for (let day of days) {
        day.classList.remove("calendar__day-item--clicked");
    }

    event.target.classList.add("calendar__day-item--clicked");
    localStorageItemName = event.target.id;

    printTodos(localStorageItemName);
}

//일별 todo리스트를 출력할때 사용하는 function
function printTodos(itemId) {
    const todosDay = todosTitle.querySelector("span:first-child");
    const todosDayOfWeek = todosTitle.querySelector("span:nth-child(2)");
    const todosListItemsContainer = document.querySelector(".todos__list");
    const tmpDay = new Date(
        itemId.substr(1, 4),
        itemId.substr(5, 2) - 1,
        itemId.substr(7, 2)
    ).getDay();
    dateOfMonth = itemId.substr(7, 2);
    todosDay.innerText = dateOfMonth;
    todosDayOfWeek.innerText = getDayOfWeek[tmpDay];
    for (d of extractedHolidays) {
        if (d.locdate == itemId.substring(1)) {
            todosDayOfWeek.innerText = todosDayOfWeek.innerText + `(${d.dateName})`;
        }
    }
    todosListItemsContainer.innerText = "";
    todoListItems = JSON.parse(localStorage.getItem(itemId));
    if (todoListItems !== null) {
        for (let i = 0; i < todoListItems.length; i++) {
            let todoListItem = document.createElement("li");
            todoListItem.innerText = `${todoListItems[i].text} `;
            todoListItem.id = `${todoListItems[i].id}`;
            let str = "<i class='fa-solid fa-trash-can'></i>";
            let parser = new DOMParser();
            let doc = parser.parseFromString(str, "text/html");
            let trashIcon = doc.body.querySelector("i");
            trashIcon.addEventListener("click", deleteTodoItem);
            todoListItem.appendChild(trashIcon);
            todosListItemsContainer.appendChild(todoListItem);
        }
    }
}

//to-do 리스트 입력 처리 function
function addTodoItem(event) {
    event.preventDefault();
    let todos = [];
    let savedTodos = JSON.parse(localStorage.getItem(localStorageItemName));
    if (savedTodos !== null) {
        //todos에 Null이 들어간다면 todos는 빈 배열에서 null로 변해버림, null인 상태에서 push가 되지않음
        todos = savedTodos;
    }
    if (todosInput.value.trim() === "") {
        todosInput.value = "";
        return;
    }
    const newTodosItem = {
        id: Date.now(),
        text: todosInput.value,
    };
    todos.push(newTodosItem);
    localStorage.setItem(localStorageItemName, JSON.stringify(todos));
    printTodos(localStorageItemName);
    todosInput.value = "";
    if (todos.length >= 1) {
        createDayItem(
            document.getElementById(localStorageItemName),
            localStorageItemName
        );
    }
}

function createDayItem(calendarDayElement, calendarDayElementId) {
    // if (calendarDayElement.querySelector(".calendar__day-item-notification") == null) {
    let calendarDayElementNotification;
    calendarDayElement.id = calendarDayElementId;
    if (localStorage.getItem(calendarDayElementId) !== null) {
        calendarDayElementNotification = document.createElement("span");
        calendarDayElementNotification.classList.add(
            "calendar__day-item-notification"
        );
        calendarDayElement.addEventListener("mouseover", dayItemMouseover);
        calendarDayElement.addEventListener("mouseleave", dayItemMouseleave);
        calendarDayElement.appendChild(calendarDayElementNotification);
    }
    calendarDayElement.classList.add("calendar__day-item");

    return calendarDayElement;
}

//캘린더 [전달 + 1~N + 다음달] 출력을 위한 function
async function printDay(targetYear, targetMonth) {
    // getHolidaysOfTargetMonth();

    calendarTitle.innerText = `${getMonth[targetMonth]} - ${targetYear}`;
    calendarDay.innerText = "";
    calendarLoadingIcon.style.display = "flex";

    let calendarDayElement;
    const beforeYear = calcBeforeYear(targetYear, targetMonth);
    const nextYear = calcNextYear(targetYear, targetMonth);
    const nextMonth = calcNextMonth(targetMonth);
    const beforeMonth = calcBeforeMonth(targetMonth);

    let calendarDayElementId;
    //이전달
    for (
        let i =
            new Date(beforeYear, beforeMonth + 1, 0).getDate() -
            (new Date(targetYear, targetMonth, 1).getDay() - 1);
        i <= new Date(beforeYear, beforeMonth + 1, 0).getDate();
        i++
    ) {
        calendarDayElement = document.createElement("span");
        calendarDayElement.innerText = `${i}`;
        calendarDayElementId = `D${beforeYear}${String(beforeMonth + 1).padStart(
            2,
            "0"
        )}${i}`;
        createDayItem(calendarDayElement, calendarDayElementId);
        calendarDayElement.classList.add("calendar__day--gray");
        calendarDay.appendChild(calendarDayElement);
        document
            .querySelector(`#${calendarDayElementId}`)
            .addEventListener("click", dayItemClick);
    }
    //현재
    for (
        let j = 1;
        j <= new Date(targetYear, targetMonth + 1, 0).getDate();
        j++
    ) {
        calendarDayElement = document.createElement("span");
        calendarDayElement.innerText = String(j).padStart(2, "0");
        calendarDayElementId = `D${targetYear}${String(targetMonth + 1).padStart(
            2,
            "0"
        )}${String(j).padStart(2, "0")}`;
        createDayItem(calendarDayElement, calendarDayElementId);
        calendarDay.appendChild(calendarDayElement);
        document
            .querySelector(`#${calendarDayElementId}`)
            .addEventListener("click", dayItemClick);
    }
    //다음달
    if (!(7 - new Date(nextYear, nextMonth, 1).getDay() === 7)) {
        for (let k = 1; k <= 7 - new Date(nextYear, nextMonth, 1).getDay(); k++) {
            calendarDayElement = document.createElement("span");
            calendarDayElement.innerText = String(k).padStart(2, "0");
            calendarDayElementId = `D${nextYear}${String(nextMonth + 1).padStart(
                2,
                "0"
            )}${String(k).padStart(2, "0")}`;
            createDayItem(calendarDayElement, calendarDayElementId);
            calendarDayElement.classList.add("calendar__day--gray");
            calendarDay.appendChild(calendarDayElement);
            document
                .querySelector(`#${calendarDayElementId}`)
                .addEventListener("click", dayItemClick);
        }
    }
    //휴일 랜더링
    await findHolidaysFromLocal(nextYear);
    await findHolidaysFromLocal(year);
    await findHolidaysFromLocal(beforeYear);
    console.log("api조회 완료");
    calendarLoadingIcon.style.display = "none";
    extractedHolidays = createHolidaysArray(
        beforeYear,
        beforeMonth,
        year,
        month,
        nextYear,
        nextMonth
    );
    console.log("==========holidays :============");
    console.log(extractedHolidays);
    for (holiday of extractedHolidays) {
        // console.log(document.getElementById("D"+holiday.locdate));
        const holidayElement = document.getElementById("D" + holiday.locdate);
        if (holidayElement !== null) {
            holidayElement.style.backgroundColor = "rgba(191,35,57,.2)";
        }
    }
}

//캘린더 월 이동 처리 위한 function
async function clickBeforeMonth() {
    if (apiLoading == false) {
        const targetDate = new Date(year, month - 1, 1);
        year = targetDate.getFullYear();
        month = targetDate.getMonth();
        printDay(year, month);
    }
}

async function clickNextMonth() {
    if (apiLoading == false) {
        const targetDate = new Date(year, month + 1, 1);
        year = targetDate.getFullYear();
        month = targetDate.getMonth();
        if (targetDate.getFullYear() < 2025) {
            printDay(year, month);
            return;
        }
        alert("2024년까지 기능을 제공합니다.");
    }
}

function calcBeforeMonth(targetMonth) {
    targetMonth = targetMonth - 1;
    if (targetMonth < 0) {
        targetMonth = 11;
    }
    return targetMonth;
}

function calcBeforeYear(targetYear, targetMonth) {
    targetMonth = targetMonth - 1;
    if (targetMonth < 0) {
        targetMonth = 11;
        targetYear = targetYear - 1;
    }
    return targetYear;
}

function calcNextMonth(targetMonth) {
    targetMonth = targetMonth + 1;
    if (targetMonth > 11) {
        targetMonth = 0;
    }
    return targetMonth;
}

function calcNextYear(targetYear, targetMonth) {
    targetMonth = targetMonth + 1;
    if (targetMonth > 11) {
        targetYear = targetYear + 1;
    }
    return targetYear;
}

//=======수정전============/
//
// async function findHolidaysFromLocal(targetYear) {
//     apiLoading = true;
//     if (localStorage.getItem("H" + targetYear) == null) {
//         await createHolidaysToLocalStorage(targetYear);
//     }
//     apiLoading = false;
// }
//
// async function createHolidaysToLocalStorage(year) {
//     const holidaysPerMonth = [];
//     for (let i = 0; i < 12; i++) {
//         holidaysPerMonth.push(await getHolidayFromOpenApi(year, i));
//     }
//     localStorage.setItem("H" + year, JSON.stringify(holidaysPerMonth));
//
// }
// async function getHolidayFromOpenApi(year, month) { //promise all 적용
//     /*
//     {
//     "response":{
//                     "header":{
//                                 "resultCode":"00",
//                                 "resultMsg":"NORMAL SERVICE."
//                               },
//                     "body":{
//                                 "items":{
//                                              /==여러값일때==/
//                                             "item":[{"dateKind":"01","dateName":"추석","isHoliday":"Y","locdate":20150926,"seq":1},
//                                                     {"dateKind":"01","dateName":"추석","isHoliday":"Y","locdate":20150927,"seq":1},
//                                                     {"dateKind":"01","dateName":"추석","isHoliday":"Y","locdate":20150928,"seq":1},
//                                                     {"dateKind":"01","dateName":"대체공휴일","isHoliday":"Y","locdate":20150929,"seq":1}]
//                                               /==값이 하나일때==/
//                                              "item":{"dateKind":"01","dateName":"추석","isHoliday":"Y","locdate":20150926,"seq":1}
//                                          },
//                                 "numOfRows":10,
//                                 "pageNo":1,
//                                 "totalCount":4
//                             }
//                 }
//      }
//      */
//     let holidays = [];
//     // console.log("========= 1 출력 =========");
//     const response = await fetch("https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=ekC4oLj9HiRR136lGjdLiiNDOzqPEKSYXbumkXqOxtHTCnA1pxSmHbI4FacDWPcwui2XiEme6dl9UJT2Bva6fA%3D%3D&solYear=" + year + "&solMonth=" + String(month + 1).padStart(2, "0") + "&_type=json");
//     const openApiHoliday = await response.json();
//     const data = openApiHoliday.response.body;
//     if (data.totalCount == 0) {
//         console.log("쉬는날 없음");
//     }
//     if (data.totalCount == 1) {
//         // console.log("쉬는날 하루");
//         console.log(data.items.item);
//         holidays.push(data.items.item);
//     }
//     if (data.totalCount > 1) {
//         console.log("쉬는날 하루 이상");
//         holidays = data.items.item;
//     }
//     return holidays;
// }