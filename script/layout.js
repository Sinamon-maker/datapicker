import { isEquelToDate, isDateBetween } from "./utils/index.js";
import { WEEK_DAYS, defaultDay, defaultLocale } from "./var.js";

const firstDay = defaultDay;

const setLayout = (arrBtns, monthList, data1, data2) => {
  for (let i = 0; i < arrBtns.length; i += 1) {
    const { data: dateBtn, current } = monthList[i];

    arrBtns[i].textContent = new Date(dateBtn).getDate();
    arrBtns[i].className = "calendar__day-btn";
    if (!current) {
      arrBtns[i].disabled = true;
      continue;
    } else {
      arrBtns[i].disabled = false;
    }

    const currentDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ).getTime();

    if (isEquelToDate(dateBtn, currentDate)) {
      arrBtns[i].classList.add("calendar__day-btn-current");
      continue;
    }

    if (isEquelToDate(dateBtn, data1) || isEquelToDate(dateBtn, data2)) {
      arrBtns[i].classList.add("calendar__day-btn-choosed");
      continue;
    }
    if (data1 && data2 && isDateBetween(dateBtn, data1, data2)) {
      arrBtns[i].classList.add("calendar__day-btn-between");
      continue;
    }
  }
};

const createButtons = (wrapper, handleClickDay) => {
  const listOfDays = new Array(5 * 7).fill(0);
  listOfDays.map((element, index) => {
    const btn = document.createElement("button");
    btn.classList.add("calendar__day-btn");
    btn.setAttribute("type", "button");
    btn.setAttribute("name", "button-day");
    btn.textContent = element;
    btn.addEventListener("click", () => handleClickDay(element, index));
    wrapper.append(btn);
  });
};

const createWeekContent = (wrapper) => {
  for (let i = 0; i < 7; i += 1) {
    const element = document.createElement("span");
    element.classList.add("calendar__week-day");
    element.textContent = WEEK_DAYS[firstDay][i];
    wrapper.append(element);
  }
};

const createMonthContent = (wrapper, month, year, clickForth, clickBack) => {
  const element = document.createElement("button");
  element.setAttribute("type", "button");
  element.className = "calendar__month-btn calendar__month-back";
  element.addEventListener("click", () => {
    clickBack();
  });
  wrapper.append(element);

  const title = document.createElement("span");
  title.className = "calendar__month-title";
  const titleText = new Intl.DateTimeFormat(defaultLocale, {
    year: "numeric",
    month: "long",
  }).format(new Date(year, month));
  title.textContent = `${titleText}`;
  wrapper.append(title);
  const btnForth = document.createElement("button");
  btnForth.setAttribute("type", "button");
  btnForth.className = "calendar__month-btn calendar__month-forth";
  btnForth.addEventListener("click", () => {
    clickForth();
  });
  wrapper.append(btnForth);
};

const setMonthLayout = (wrapper, year, month) => {
  const titleText = new Intl.DateTimeFormat(defaultLocale, {
    year: "numeric",
    month: "long",
  }).format(new Date(year, month));
  wrapper.textContent = `${titleText}`;
};

const setInputsLayout = (inputs, data1, data2) => {
  if (data1) {
    const value1 = new Intl.DateTimeFormat(defaultLocale).format(
      new Date(data1)
    );

    inputs[0].value = value1 ?? "";
  }
  if (data2) {
    const value2 = new Intl.DateTimeFormat(defaultLocale).format(
      new Date(data2)
    );
    inputs[1].value = value2 ?? "";
  }
};

class LayoutBuilder {
  constructot() {}

  createMainContent(selector, clickMonth, clickDay) {
    const calendarConainer = document.querySelector(selector);
    const calendarContant = document.createElement("div");
    calendarContant.className = "calendar__content";
    const monthContent = document.createElement("div");
    monthContent.className = "calendar__month-content";

    this.createMonthContent(monthContent, clickMonth);
    calendarContant.append(monthContent);

    const weeksContent = document.createElement("div");
    weeksContent.className = "calendar__weeks-content";
    this.createWeekContent(weeksContent);
    calendarContant.append(weeksContent);

    const daysContent = document.createElement("div");
    daysContent.className = "calendar__days-content";

    this.createDaysButtons(daysContent, clickDay);
    calendarContant.append(daysContent);

    calendarConainer.append(calendarContant);
  }
  createDaysButtons(wrapper, handleClickDay) {
    const listOfDays = new Array(5 * 7).fill(0);
    listOfDays.map((element, index) => {
      const btn = document.createElement("button");
      btn.classList.add("calendar__day-btn");
      btn.setAttribute("type", "button");
      btn.setAttribute("name", "button-day");
      btn.textContent = element;
      btn.addEventListener("click", function (e) {
        return handleClickDay(element, index);
      });
      wrapper.append(btn);
    });
  }

  createMonthContent(wrapper, clickForth) {
    const element = document.createElement("button");
    element.setAttribute("type", "button");
    element.className = "calendar__month-btn calendar__month-back";
    element.addEventListener("click", () => {
      clickForth("back");
    });
    wrapper.append(element);

    const title = document.createElement("span");
    title.className = "calendar__month-title";

    title.textContent = "";
    wrapper.append(title);
    const btnForth = document.createElement("button");
    btnForth.setAttribute("type", "button");
    btnForth.className = "calendar__month-btn calendar__month-forth";
    btnForth.addEventListener("click", () => {
      clickForth("forth");
    });
    wrapper.append(btnForth);
  }

  createWeekContent(wrapper) {
    for (let i = 0; i < 7; i += 1) {
      const element = document.createElement("span");
      element.classList.add("calendar__week-day");
      element.textContent = WEEK_DAYS[firstDay][i];
      wrapper.append(element);
    }
  }

  setLayout(selector, monthList, data1, data2) {
    const daysContent = document.querySelector(
      `div${selector} div.calendar__content `
    );

    const btns = daysContent.childNodes[2].childNodes;
    for (let i = 0; i < btns.length; i += 1) {
      const { data: dateBtn, current } = monthList[i];

      btns[i].textContent = new Date(dateBtn).getDate();
      btns[i].className = "calendar__day-btn";
      if (!current) {
        btns[i].disabled = true;
        continue;
      } else {
        btns[i].disabled = false;
      }

      const currentDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ).getTime();

      if (isEquelToDate(dateBtn, currentDate)) {
        btns[i].classList.add("calendar__day-btn-current");
      }

      if (isEquelToDate(dateBtn, data1) || isEquelToDate(dateBtn, data2)) {
        btns[i].classList.add("calendar__day-btn-choosed");
      }
      if (data1 && data2) {
        if (isDateBetween(dateBtn, data1, data2)) {
          btns[i].classList.add("calendar__day-btn-between");
        }
        if (isEquelToDate(dateBtn, data1)) {
          btns[i].classList.add("calendar__day-btn-double-left");
        }
        if (isEquelToDate(dateBtn, data2)) {
          btns[i].classList.add("calendar__day-btn-double-right");
        }
      }
    }
  }

  setMonthLayout(selector, year, month) {
    const daysContent = document.querySelector(
      `div${selector} div.calendar__content `
    );

    const titleWrapper = daysContent.childNodes[0].childNodes[1];
    const titleText = new Intl.DateTimeFormat(defaultLocale, {
      year: "numeric",
      month: "long",
    }).format(new Date(year, month));
    titleWrapper.textContent = `${titleText}`;
  }

  setInputsLayout(selector, index, data) {
    const inputs = document.querySelectorAll(`${selector} input`);
    if (inputs.length) {
      inputs[index].value = data;
    }
  }

  setInputClicks(selector, handleInputClick) {
    const inputBtns = document.querySelectorAll(`${selector} button`);
    console.log({ inputBtns });
    inputBtns.forEach((el, ind) => {
      el.addEventListener("click", () => {
        handleInputClick(el, ind);
      });
    });
  }
}

export const layoutBuilder = new LayoutBuilder();
