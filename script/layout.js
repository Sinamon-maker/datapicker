import { isEquelToDate, isDateBetween, isWeekend } from "./utils/index.js";
import { WEEK_DAYS, WEEKEND, defaultDay, defaultLocale } from "./var.js";

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

  createElement(tag, opts) {
    const el = document.createElement(tag);
    Object.assign(el, opts);
    return el;
  }

  createDayBtn(element, index, handleClickDay) {
    const btn = this.createElement("button", {
      className: "calendar__day-btn",
      type: "button",
      name: "button-day",
      textContent: element,
    });

    btn.addEventListener("click", function (e) {
      return handleClickDay(btn, index);
    });
    return btn;
  }

  createMainContent(selector, alwaisShown, clickMonth, clickDay, styles) {
    const calendarConainer = document.querySelector(selector);
    if (alwaisShown) {
      calendarConainer.classList.add("form-calendar__container-opened");
    }
    const calendarContant = this.createElement("div", {
      className: "calendar__content",
    });
    if (Object.keys(styles).length) {
      Object.keys(styles).forEach(
        (it) => (calendarContant.style[it] = styles[it])
      );
    }

    const monthContent = this.createElement("div", {
      className: "calendar__month-content",
    });

    this.createMonthContent(monthContent, clickMonth);
    calendarContant.append(monthContent);

    const weeksContent = this.createElement("div", {
      className: "calendar__weeks-content",
    });

    this.createWeekContent(weeksContent);
    calendarContant.append(weeksContent);

    const daysContent = this.createElement("div", {
      className: "calendar__days-content",
    });

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
    const element = this.createElement("button", {
      className: "calendar__month-btn calendar__month-back",
      type: "button",
      ariaLabel: "previousMonth",
    });

    element.addEventListener("click", () => {
      clickForth("back");
    });
    wrapper.append(element);

    const title = this.createElement("span", {
      className: "calendar__month-title",
      textContent: "",
    });

    wrapper.append(title);
    const btnForth = this.createElement("button", {
      className: "calendar__month-btn calendar__month-forth",
      type: "button",
      ariaLabel: "nextMonth",
    });

    btnForth.addEventListener("click", () => {
      clickForth("forth");
    });
    wrapper.append(btnForth);
  }

  createWeekContent(wrapper) {
    for (let i = 0; i < 7; i += 1) {
      const element = this.createElement("span", {
        className: "calendar__week-day",
        textContent: WEEK_DAYS[firstDay][i],
      });

      if (WEEKEND.includes(i)) {
        element.style.color = "red";
      }
      wrapper.append(element);
    }
  }

  setLayoutForBtn(dateBtn, btn, data1, data2) {
    const currentDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ).getTime();

    if (isEquelToDate(dateBtn, currentDate)) {
      btn.classList.add("calendar__day-btn-current");
    }
    if (isEquelToDate(dateBtn, data1) || isEquelToDate(dateBtn, data2)) {
      btn.classList.add("calendar__day-btn-choosed");
    }
    if (data1 && data2) {
      if (isDateBetween(dateBtn, data1, data2)) {
        btn.classList.add("calendar__day-btn-between");
      }
      if (isEquelToDate(dateBtn, data1)) {
        btn.classList.add("calendar__day-btn-double-left");
      }
      if (isEquelToDate(dateBtn, data2)) {
        btn.classList.add("calendar__day-btn-double-right");
      }
    }
  }

  setLayout(selector, monthList, data) {
    const data1 = data[0];
    const data2 = data[1];
    const daysContent = this.findElemBySelector(
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
      if (isWeekend(dateBtn, WEEKEND)) {
        btns[i].style.color = "red";
      }

      this.setLayoutForBtn(dateBtn, btns[i], data1, data2);
    }
  }

  updateLayout(selector, monthList, data) {
    const data1 = data[0];
    const data2 = data[1];
    const daysContent = this.findElemBySelector(
      `div${selector} div.calendar__content `
    );

    const btns = daysContent.childNodes[2].childNodes;
    for (let i = 0; i < btns.length; i += 1) {
      const { data: dateBtn } = monthList[i];

      btns[i].className = "calendar__day-btn";
      if (btns[i].disabled) {
        continue;
      }

      this.setLayoutForBtn(dateBtn, btns[i], data1, data2);
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
    const input = document.querySelector(`${selector}`);
    if (!data) input.value = "";
    else {
      input.value = func(data, defaultLocale);
    }
  }

  setInputClicks(selector, handleInputClick) {
    const inputBtn = document.querySelector(`${selector}`);

    inputBtn.addEventListener("click", (e) => {
      handleInputClick();
    });
  }
}

export const layoutBuilder = new LayoutBuilder();
