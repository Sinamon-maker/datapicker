import { MonthArray, pickers } from "./state.js";
import { layoutBuilder } from "./layout.js";

// options = {
//  id:'xxx',
//  alwaisOpen: Boolean,
//noInput: "input" || 'noInput',
//choosedBtn - class for choosed btn
//funcFormatDate - func (dada, locale)
//styles:{}

class Calendar {
  constructor(selector, listOfMonth, layoutBuilder, options) {
    this.selector = selector;
    this.listOfMonth = listOfMonth;
    this.layoutBuilder = layoutBuilder;
    this.options = { ...options } || {};
    this._data = [""];

    this._index = 0;

    this._sibling = "";
    if (options.alwaisShown) {
      this.opened = "opened";
    } else {
      this.opened = "closed";
    }
    this._alwaisShown = options.alwaisShown || false;
    if (this.options.id) {
      this.id = this.options.id;
    } else {
      this.id = (Math.random() * 100).toString();
    }
    this.noInput = options.noInput || "input"; // 'noInput',

    this.iconInput = options.iconInput || "icon"; //'noIcon'

    this.choosedBtnClass = options.choosedBtn || "calendar__day-btn-choosed";
    this.styles = options.styles || {};
    this.formadDateFunc =
      options.funcFormatDate ||
      function (date, locale) {
        return new Intl.DateTimeFormat(locale).format(new Date(date));
      };
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
  get alwaisShown() {
    return this._alwaisShown;
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

    this.layoutBuilder.createMainContent(
      this.selector,
      this._alwaisShown,
      clickMonth,
      clickDay,
      this.styles
    );
  }

  setLayout() {
    this.layoutBuilder.setLayout(
      this.selector,
      this.listOfMonth.monthList,
      this.data
    );
  }

  updateLayout() {
    this.layoutBuilder.updateLayout(
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

  setInputClick() {
    if (!this.alwaisShown) {
      //   clickElement = findBySelector: selector ===   this.inputClickBtnSelector
      // or find insideClickElement
      //then pass into setInputClicks

      // inputClick - selector for

      const selec = `${this.selector} button`;

      const inputClick = this.handleClickInput.bind(this);
      this.layoutBuilder.setInputClicks(selec, inputClick);
    }
  }

  setInputsLayout() {
    if (this.noInput !== "noInput") {
      const selec = `${this.selector} input`;

      this.layoutBuilder.setInputsLayout(
        selec,
        this.data[this.index],
        this.formadDateFunc,
        this.noInput
      );
    }
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
    if (this.addClassForOpenBtn) {
      this.addClassForOpenBtn();
    }
  }

  addClassForOpenBtn() {
    const el = document.querySelector(`${this.selector} button`);

    this.addClass(el, "input-btn__opened");
  }

  closeCalendar() {
    const owner = document.querySelector(`${this.selector}`);

    this.removeClass(owner, "form-calendar__container-opened");

    this.opened = "closed";
    if (this.addClassForOpenBtn) {
      this.removeClassForOpenBtn();
    }
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

    this.setInputClick();
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
    } else {
      this.closeCalendar();
    }
  }
}

const dataPicker = (selector, opt) => {
  const calendar = new Calendar(selector, new MonthArray(), layoutBuilder, opt);

  if (!Object.keys(pickers.dataPickers).length) {
    document.addEventListener("click", (e) => {
      const target = e.target;

      pickers.arrayPickers.forEach((elem) => {
        const classNam = elem.receiveSelector();
        const node = document.querySelector(`${classNam}`);

        if (!node.contains(target) && !elem.alwaisShown) {
          console.log("click outer");
          elem.closeCalendar();
        }
      });
    });
  }

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
dataPicker(".form-calendar__input-wrapper3", {
  id: "567ifmg",
  alwaisShown: true,
});

dataPicker(".form-calendar__container4", {
  id: "560007ifmg",
  alwaisShown: true,
  noInput: "noInput",
  styles: {
    top: "0px",
    width: "300px",
    backgroundColor: "green",
  },
});
