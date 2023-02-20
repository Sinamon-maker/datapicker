import { MonthArray, pickers } from "./state.js";
import { layoutBuilder } from "./layout.js";

class Calendar {
  constructor(selector, listOfMonth, layoutBuilder, options) {
    this.selector = selector;
    this.listOfMonth = listOfMonth;
    this.layoutBuilder = layoutBuilder;
    this.options = options || {};
    this._data = [""];

    this._index = 0;
    this.opened = "closed";
    this._sibling = "";
    if (this.options.id) {
      this.id = this.options.id;
    } else {
      this.id = (Math.random() * 100).toString();
    }
    this.choosedBtnClass = options.choosedBtn || "calendar__day-btn-choosed";
  }

  set sibling(val) {
    this._sibling = val;
  }

  get sibling() {
    return this._sibling;
  }

  set index(valu) {
    this._index = valu;
  }
  get index() {
    return this._index;
  }

  formFirstArrayMonth() {
    this.listOfMonth.changeList();
  }

  changeYearOrMonth(val) {
    this.listOfMonth.addDate(val);
  }

  receiveMonthArray() {
    return this.listOfMonth.monthList;
  }

  receiveYear() {
    return this.listOfMonth.year;
  }

  receiveMonth() {
    return this.listOfMonth.month;
  }

  get data() {
    return this._data;
  }

  set data(val) {
    this._data = val;
  }

  receiveSelector() {
    return this.selector;
  }

  setMainContent() {
    const clickMonth = this.handleClickMonthForth.bind(this);
    const clickDay = this.handleClickDay.bind(this);

    this.layoutBuilder.createMainContent(this.selector, clickMonth, clickDay);
  }

  setLayout() {
    this.layoutBuilder.setLayout(
      this.selector,
      this.listOfMonth.monthList,
      this.data
    );
  }

  setMonthLayout() {
    this.layoutBuilder.setMonthLayout(
      this.selector,
      this.listOfMonth.year,
      this.listOfMonth.month
    );
  }

  setInputsLayout() {
    this.layoutBuilder.setInputsLayout(this.selector, this.data[this.index]);
  }

  findPrevChoosedElement() {
    const elem = document.querySelector(
      `${this.selector} button.${this.choosedBtnClass}`
    );
    return elem;
  }

  addClass(el, className) {
    this.layoutBuilder.addClass(el, className);
  }

  removeClass(el, className) {
    this.layoutBuilder.removeClass(el, className);
  }

  findAndRemove(selector, className) {
    this.layoutBuilder.findElemAndRemoveClass(selector, className);
  }

  openCalendar() {
    const owner = document.querySelector(`${this.selector}`);

    this.addClass(owner, "form-calendar__container-opened");

    this.opened = "opened";
  }

  addClassForOpenBtn() {
    const el = document.querySelector(`${this.selector} button`);

    this.addClass(el, "input-btn__opened");
  }

  closeCalendar() {
    const owner = document.querySelector(`${this.selector}`);

    this.removeClass(owner, "form-calendar__container-opened");

    this.opened = "closed";
  }

  removeClassForOpenBtn() {
    const el = document.querySelector(`${this.selector} button`);

    this.removeClass(el, "input-btn__opened");
  }

  createCalendar() {
    this.setMainContent();

    this.formFirstArrayMonth();

    this.setMonthLayout();
    this.setLayout();

    const inputClick = this.handleClickInput.bind(this);
    this.layoutBuilder.setInputClicks(this.selector, inputClick);
  }

  handleClickDay(el, ind) {
    const list = this.receiveMonthArray();
    const newData = list[ind].data;

    if (!this.sibling) {
      this.findAndRemove(
        `${this.selector} button.${this.choosedBtnClass}`,
        `${this.choosedBtnClass}`
      );
      if (this._data[0] === newData) {
        this._data[0] = "";
        this.setInputsLayout();
      } else {
        this._data[0] = newData;

        this.addClass(el, `${this.choosedBtnClass}`);
        this.setInputsLayout();
      }
    } else {
      pickers.synchronyzeChoosedData(this.id, this._index, newData);
    }
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
    if (this._data.length === 1) {
      this.changeYearOrMonth(newDate);
      this.setLayout();
      this.setMonthLayout();
    } else {
      pickers.synchronyzeMonthYearChanging(this.id, newDate);
    }
  }

  handleClickInput() {
    if (this.opened === "closed") {
      this.openCalendar();
      this.addClassForOpenBtn();
    } else {
      this.closeCalendar();
      this.removeClassForOpenBtn();
    }
  }
}

const dataPicker = (selector, opt) => {
  const calendar = new Calendar(selector, new MonthArray(), layoutBuilder, opt);
  try {
    pickers.addPicker(calendar);
    calendar.createCalendar();
    return calendar;
  } catch (error) {
    console.log(error);
  }
};

dataPicker(".form-calendar__input-wrapper1", { id: "567ifmgb" });
dataPicker(".form-calendar__input-wrapper2", { id: "567ifmgb" });
dataPicker(".form-calendar__input-wrapper3", { id: "567ifmg" });
