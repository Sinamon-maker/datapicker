import { isEquelToDate, isDateBetween } from "./utils/index.js";
import { WEEK_DAYS, defaultDay, defaultLocale } from "./var.js";

const firstDay = defaultDay;

class LayoutBuilder {
  constructot() {}

  addClass(el, className) {
    el.classList.add(`${className}`);
  }

  removeClass(el, className) {
    el.classList.remove(`${className}`);
  }

  findElemBySelector(selector) {
    return document.querySelector(`${selector}`);
  }

  findElementsBySelector(selector) {
    return document.querySelectorAll(`${selector}`);
  }

  findElemAndRemoveClass(selector, className) {
    const removed = this.findElemBySelector(selector);
    if (removed) {
      this.removeClass(removed, className);
    }
  }

  createDayBtn(element, index, handleClickDay) {
    const btn = document.createElement("button");
    btn.classList.add("calendar__day-btn");
    btn.setAttribute("type", "button");
    btn.setAttribute("name", "button-day");
    btn.textContent = element;
    btn.addEventListener("click", function (e) {
      return handleClickDay(btn, index);
    });
    return btn;
  }
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
      const btn = this.createDayBtn(element, index, handleClickDay);
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

  setLayout(selector, monthList, data) {
    const data1 = data[0];
    const data2 = data[1];
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

  setInputsLayout(selector, data, func) {
    const input = document.querySelector(`${selector} input`);
    if (!data) input.value = "";
    else {
      input.value = func(data, defaultLocale);
      //  input.value = new Intl.DateTimeFormat(defaultLocale).format(
      //    new Date(data)
      //  );
    }
  }

  setInputClicks(selector, handleInputClick) {
    const inputBtn = document.querySelector(`${selector} button`);
    console.log({ inputBtn });
    inputBtn.addEventListener("click", (e) => {
      console.log(e.target, e.currentTarget);
      handleInputClick();
    });
  }
}

export const layoutBuilder = new LayoutBuilder();
