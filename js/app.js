//============================== 참고 자료 ==============================//
//https://nomadcoders.co/ - > 코코아톡 클론 코딩, 바닐라 js로 크롬앱 만들기
//============================== 캘린더 변수==============================//
const date = new Date();

const getMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const getDayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const calendarTitle = document.querySelector(".calendar__title span:nth-child(2)");
const leftChevron = document.querySelector(".calendar__title span:first-child");
const rightChevron = document.querySelector(".calendar__title span:last-child");
const calendarDay = document.querySelector(".calendar__day");
const calendarLoadingIcon = document.querySelector(".calendar__loading");
const todosTitle = document.querySelector(".todos__title");
//초기화면을 위한 날짜, 최초의 화면은 현재 날짜로 하기 위함
const nowMonth = date.getMonth();
const nowYear = date.getFullYear();
const nowDate = date.getDate();
//calendar__title을 출력할때 사용하는 임시 변수, calendar의 현재 날짜와 날짜를 이동할시나 달력의 day를 그릴때 parameter로 이용함
let year = nowYear;
let month = nowMonth;
let dateOfMonth = nowDate;
let apiLoading = false;

//휴일 구하기
async function getHolidayFromOpenApi(year, month) {
    const holidays = [];
    // console.log("========= 1 출력 =========");
    const response = await fetch("https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?serviceKey=ekC4oLj9HiRR136lGjdLiiNDOzqPEKSYXbumkXqOxtHTCnA1pxSmHbI4FacDWPcwui2XiEme6dl9UJT2Bva6fA%3D%3D&solYear=" + year + "&solMonth=" + String(month + 1).padStart(2, "0") + "&_type=json");
    const openApiHoliday = await response.json();
    const data = openApiHoliday.response.body;
    if (data.totalCount == 0) {
        console.log("쉬는날 없음");
    }
    if (data.totalCount == 1) {
        // console.log("쉬는날 하루");
        console.log(data.items.item);
        holidays.push(data.items.item);
    }
    if (data.totalCount > 1) {
        // console.log("쉬는날 하루 이상");
        for (let holiday of data.items.item) {
            console.log(holiday);
            holidays.push(holiday);
        }
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
        nextYear = year + 1
    }
    const nowSeconds = Date.now();
    console.log("실행1");
    await getHolidayFromOpenApi(befroeYear, befroeMonth);
    console.log("실행2");
    await getHolidayFromOpenApi(year, month);
    console.log("실행3");
    await getHolidayFromOpenApi(nextYear, nextMonth);
    const afterSeconds = Date.now();
    const totalSeconds = String((Number(afterSeconds) - Number(nowSeconds)) / 1000);
    console.log("걸린시간 : " + totalSeconds + "초");
}

async function createHolidaysToLocalStorage(year) {
    const holidaysPerMonth = [];
    for (let i = 0; i < 12; i++) {
        holidaysPerMonth.push(await getHolidayFromOpenApi(year, i));
    }
    localStorage.setItem("H" + year, JSON.stringify(holidaysPerMonth));

}

//============================== to-do 리스트 변수 ==============================//
// todo를 꺼낼때 localstorage에서 가져옴, 따라서 키가 필요함, 초기 todo값은
const todosInput = document.querySelector(".todos__input");
let todos = [];


//최초의 todos를 출력할때를 위해 초기화한다.,현재 날짜의 todos를 localStorage에서 가져온다.
const todayKey = `D${nowYear}${String(nowMonth + 1).padStart(2, "0")}${String(nowDate).padStart(2, "0")}`;
let todoListItems = JSON.parse(localStorage.getItem(todayKey));
let savedTodos = JSON.parse(localStorage.getItem(todayKey));
if (savedTodos !== null) {
    todos = savedTodos;
}
//사용자가 현재 사용하는 달력의 날짜를 의미한다. 해당 값을 통해 localStroage에서 todo를 가져온다. 정확히는 지금 보고 있는 day의 아이디 값이다.
let localStorageItemName = todayKey;
//============================================================//

//일별 todo리스트를 출력할때 사용하는 function
function printTodos(itemId) {
    let todosDay = todosTitle.querySelector("span:first-child");
    let todosDayOfWeek = todosTitle.querySelector("span:nth-child(2)");
    let todosListItemsContainer = document.querySelector(".todos__list");
    dateOfMonth = itemId.substr(7, 2);
    let tmpDay = new Date(itemId.substr(1, 4), itemId.substr(5, 2) - 1, itemId.substr(7, 2)).getDay();
    todosDay.innerText = dateOfMonth;
    todosDayOfWeek.innerText = getDayOfWeek[tmpDay];
    todoListItems = JSON.parse(localStorage.getItem(itemId));
    todosListItemsContainer.innerText = "";
    if (todoListItems !== null) {
        for (let i = 0; i < todoListItems.length; i++) {
            let todoListItem = document.createElement("li");
            todoListItem.innerText = `${todoListItems[i].text}`;
            todosListItemsContainer.appendChild(todoListItem);
        }
    }
}

// notification을 가진 day를 Mouseover할시에 작동하는 function

function handleCalendarDayItemMouseover(event) {
    event.target.classList.add("calendar__day--hover");
    event.target.innerText = JSON.parse(localStorage.getItem(`D${event.target.id.substr(1, 4)}${event.target.id.substr(5, 2)}${event.target.id.substr(7, 2)}`)).length;

}

// notification을 가진 day를 Mouseleave할시에 작동하는 function
function handleCalendarDayItemMouseleave(event) {
    event.target.classList.remove("calendar__day--hover");
    event.target.innerText = `${event.target.id.substring(7, 9)}`;
    let addNotification = document.createElement("span");
    addNotification.classList.add("calendar__day-element--notification");
    event.target.appendChild(addNotification);
    document.querySelector(`#${event.target.id}`).addEventListener("click", handleCalendarDayItem);


}

// day를 click할시에 작동하는 function
function handleCalendarDayItem(event) {
    //D 2022 11 10
    //calendar__day--clicked 효과 적용
    dateOfMonth = event.target.id.substring(event.target.id.length - 2, event.target.id.length);
    let days = document.querySelectorAll(".calendar__day-element");
    // for (let d = 0; d < days.length; d++) {
    for (let day of days) {
        day.classList.remove("calendar__day--clicked");
    }
    event.target.classList.add("calendar__day--clicked");
    localStorageItemName = event.target.id;
    todos = [];
    savedTodos = JSON.parse(localStorage.getItem(localStorageItemName));
    if (savedTodos !== null) {
        //todos에 Null이 들어간다면 todos는 빈 배열에서 null로 변해버림, null인 상태에서 push가 되지않음
        todos = savedTodos;
    }
    printTodos(localStorageItemName);

}

//캘린더 [전달 + 1~N + 다음달] 출력을 위한 function 에 공통으로 사용되는 함수

function createCalendarDayElement(calendarDayElement, calendarDayElementId) {
    // if (calendarDayElement.querySelector(".calendar__day-element--notification") == null) {
    let calendarDayElementNotification;
    calendarDayElement.id = calendarDayElementId
    if (localStorage.getItem(calendarDayElementId) !== null) {
        calendarDayElementNotification = document.createElement("span");
        calendarDayElementNotification.classList.add("calendar__day-element--notification");
        calendarDayElement.addEventListener("mouseover", handleCalendarDayItemMouseover);
        calendarDayElement.addEventListener("mouseleave", handleCalendarDayItemMouseleave);
        calendarDayElement.appendChild(calendarDayElementNotification);
    }
    calendarDayElement.classList.add("calendar__day-element");

    return calendarDayElement;
}

async function findHolidaysFromLocal(targetYear) {
    apiLoading = true;
    if (localStorage.getItem("H" + targetYear) == null) {
        await createHolidaysToLocalStorage(targetYear);
    }
    apiLoading = false;
}

// function getHolidaysOfTargetMonth() {
//     const holidaysOfTargetMonth = [];
//
//
//
//     return holidaysOfTargetMonth;
// }

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

//캘린더 [전달 + 1~N + 다음달] 출력을 위한 function
async function printDay(targetYear, targetMonth) {
    // getHolidaysOfTargetMonth();

    calendarTitle.innerText = `${getMonth[targetMonth]} - ${targetYear}`;
    calendarDay.innerText = "";
    calendarLoadingIcon.style.display = 'flex';

    let calendarDayElement;
    const beforeYear = calcBeforeYear(targetYear, targetMonth);


    const nextYear = calcNextYear(targetYear, targetMonth);

    const nextMonth = calcNextMonth(targetMonth);
    const beforeMonth = calcBeforeMonth(targetMonth);
    await findHolidaysFromLocal(nextYear);
    await findHolidaysFromLocal(year);
    await findHolidaysFromLocal(beforeYear);
    calendarLoadingIcon.style.display = 'none';

    let calendarDayElementId = "";
    //이전달
    for (let i = day[beforeMonth] - (new Date(targetYear, targetMonth, 1).getDay() - 1); i <= day[beforeMonth]; i++) {
        calendarDayElement = document.createElement("span");
        calendarDayElement.innerText = `${i}`;
        calendarDayElementId = `D${beforeYear}${String(beforeMonth + 1).padStart(2, "0")}${i}`;
        createCalendarDayElement(calendarDayElement, calendarDayElementId);
        // calendarDayElement.classList.add("calendar__day-element");
        calendarDayElement.classList.add("calendar__day--gray");
        calendarDay.appendChild(calendarDayElement);
        document.querySelector(`#${calendarDayElementId}`).addEventListener("click", handleCalendarDayItem);
    }
    //현재
    for (let j = 1; j <= day[targetMonth]; j++) {
        calendarDayElement = document.createElement("span");
        calendarDayElement.innerText = String(j).padStart(2, "0");
        calendarDayElementId = `D${targetYear}${String(targetMonth + 1).padStart(2, "0")}${String(j).padStart(2, "0")}`
        createCalendarDayElement(calendarDayElement, calendarDayElementId);
        // calendarDayElement.classList.add("calendar__day-element");
        calendarDay.appendChild(calendarDayElement);
        document.querySelector(`#${calendarDayElementId}`).addEventListener("click", handleCalendarDayItem);
    }
    //다음달
    if (!(7 - (new Date(nextYear, nextMonth, 1).getDay()) === 7)) {
        for (let k = 1; k <= 7 - (new Date(nextYear, nextMonth, 1).getDay()); k++) {
            calendarDayElement = document.createElement("span");
            calendarDayElement.innerText = String(k).padStart(2, "0");
            calendarDayElementId = `D${nextYear}${String(nextMonth + 1).padStart(2, "0")}${String(k).padStart(2, "0")}`;
            createCalendarDayElement(calendarDayElement, calendarDayElementId);
            // calendarDayElement.classList.add("calendar__day-element");
            calendarDayElement.classList.add("calendar__day--gray");
            calendarDay.appendChild(calendarDayElement);
            document.querySelector(`#${calendarDayElementId}`).addEventListener("click", handleCalendarDayItem);
        }
    }
}


//캘린더 월 이동 처리 위한 function
async function printBeforeMonth() {
    if(apiLoading==false) {
        year = await calcBeforeYear(year, month);
        month = await calcBeforeMonth(month);
        await printDay(year, month);
    }
}

async function printNextMonth() {
    if (apiLoading == false) {
        year = await calcNextYear(year, month)
        month = await calcNextMonth(month);
        await printDay(year, month);
    }
}

//to-do 리스트 입력 처리 function
function handleToDoButton(event) {
    event.preventDefault();
    if (todosInput.value === "") {
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

    createCalendarDayElement(document.getElementById(localStorageItemName), localStorageItemName);
}

async function initCalendar() {
    // if(localStorage.getItem("h"+nowYear)==null){
    //     await createHolidayOfLocalStorage(nowYear);
    // }
    // holidaysPerMonth = JSON.parse(localStorage.getItem("h"+nowYear));
    // console.log(holidaysPerMonth);
//캘린더 초기값 [calendar__day span] 출력
    await printDay(nowYear, nowMonth);
    document.querySelector(`#D${nowYear}${nowMonth + 1}${String(nowDate).padStart(2, "0")}`).classList.add("calendar__day--clicked");
// printHoliday(nowYear,nowMonth);
//to-do 리스트 초기값 실행
    printTodos(localStorageItemName);
    // printHoliday(nowYear,nowMonth);
}

initCalendar();


//============================== calendar 월 이동 이벤트 리스너 ==============================//
//[calendar__title]의 좌우화살표 이벤트리스너
leftChevron.addEventListener("click", printBeforeMonth);
rightChevron.addEventListener("click", printNextMonth);


//============================== to-do 리스트 입력 이벤트 리스너 ==============================//
const todosForm = document.querySelector(".todos__form");
todosForm.addEventListener("submit", handleToDoButton);
