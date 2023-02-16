import { MonthArray } from "./state.js";
import { layoutBuilder } from "./layout.js";

class Calendar {
  constructor(selector, listOfMonth, layoutBuilder, amount) {
    this.selector = selector;
    this.listOfMonth = listOfMonth;
    this.layoutBuilder = layoutBuilder;
    this.amount = amount;
    if (this.amount === 2) {
      this.data = ["", ""];
    } else {
      this.data = [""];
    }
    this.index = 0;
    this.opened = "closed";
  }

  createCalendar() {
    const clickMonth = this.handleClickMonthForth.bind(this);
    const clickDay = this.handleClickDay.bind(this);

    this.layoutBuilder.createMainContent(this.selector, clickMonth, clickDay);

    this.listOfMonth.changeList();
    this.layoutBuilder.setMonthLayout(
      this.selector,
      this.listOfMonth.year,
      this.listOfMonth.month
    );
    this.layoutBuilder.setLayout(
      this.selector,
      this.listOfMonth.monthList,
      this.data[0],
      this.data[1]
    );

    const inputClick = this.handleClickInput.bind(this);
    this.layoutBuilder.setInputClicks(this.selector, inputClick);
  }

  handleClickDay(el, index) {
    const list = this.listOfMonth.monthList;
    const newData = list[index].data;
    if (this.data[this.index] === newData) {
      this.data[this.index] = "";
    } else {
      if (this.data.length === 1) {
        this.data[this.index] = list[index].data;
      } else {
        if (
          (this.index === 0 && this.data[1] && newData < this.data[1]) ||
          (this.index === 0 && !this.data[1])
        ) {
          this.data[this.index] = list[index].data;
        }
        if (
          (this.index === 1 && this.data[0] && newData > this.data[0]) ||
          (this.index === 1 && !this.data[0])
        ) {
          this.data[this.index] = list[index].data;
        }
      }
    }

    const data1 = this.data[0];
    const data2 = this.data[1];
    layoutBuilder.setLayout(this.selector, list, data1, data2);

    const data = this.data[this.index];
    layoutBuilder.setInputsLayout(this.selector, this.index, data);
  }

  handleClickMonthForth(type) {
    const year = this.listOfMonth.year;
    const month = this.listOfMonth.month;
    let newDate;
    if (type === "forth") {
      newDate = new Date(year, month + 1, 1);
    } else {
      newDate = new Date(year, month - 1, 1);
    }

    this.listOfMonth.addDate(newDate);

    this.layoutBuilder.setLayout(
      this.selector,
      this.listOfMonth.monthList,
      this.data[0],
      this.data[1]
    );
    this.layoutBuilder.setMonthLayout(
      this.selector,
      this.listOfMonth.year,
      this.listOfMonth.month
    );
  }

  handleClickInput(el, ind) {
    const owner = document.querySelector(`${this.selector}`);
    if (this.opened === "closed") {
      owner.classList.add("form-calendar__container-opened");
      this.index = ind;
      this.opened = "opened";
    } else {
      if (this.index === ind) {
        owner.classList.remove("form-calendar__container-opened");
        this.opened = "closed";
      }
    }
  }
}

const calendar = new Calendar(
  ".form-calendar__container",
  new MonthArray(),
  layoutBuilder,
  2
);

calendar.createCalendar();

const calendar2 = new Calendar(
  ".form-calendar__container2",
  new MonthArray(),
  layoutBuilder,
  2
);

calendar2.createCalendar();
