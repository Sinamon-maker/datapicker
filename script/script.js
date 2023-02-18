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
      if (this._data[0] === newData) {
        this._data[0] = "";
      } else {
        this._data[0] = newData;
      }
      this.setLayout();
    } else {
      pickers.synchronyzeChoosedData(this.id, this._index, newData);
    }

    this.setInputsLayout();
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
    const styles = ["input-btn__opened"];
    const owner = document.querySelector(`${this.selector}`);
    const el = document.querySelector(`${this.selector} button`);
    if (this.opened === "closed") {
      owner.classList.add("form-calendar__container-opened");

      this.opened = "opened";
      el.classList.add(`${styles[0]}`);
    } else {
      owner.classList.remove("form-calendar__container-opened");
      el.classList.remove(`${styles[0]}`);
      this.opened = "closed";
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
