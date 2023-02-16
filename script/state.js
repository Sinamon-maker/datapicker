import { START_WEEK_DAY } from "./var.js";

export class MonthArray {
  constructor() {
    this._monthList = new Array(7 * 5).fill(0);
    this._year = new Date().getFullYear();
    this._month = new Date().getMonth();
  }
  get monthList() {
    return this._monthList;
  }

  get month() {
    return this._month;
  }

  get year() {
    return this._year;
  }

  addDate(date) {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth();
    console.log(year, month);
    this._month = month;
    this._year = year;

    this.changeList();
  }

  changeList() {
    const weekDay = new Date(this._year, this._month, 1).getDay();
    console.log({ weekDay });
    const arrBefore = new Array(weekDay - START_WEEK_DAY.Sun).fill(0);

    for (let i = arrBefore.length - 1; i >= 0; i -= 1) {
      arrBefore[arrBefore.length - 1 - i] = {
        data: new Date(this._year, this._month, 1 - i - 1).getTime(),
        current: false,
      };
    }

    const arrMain = new Array(5 * 7 - arrBefore.length).fill(0);

    for (let k = 0; k < arrMain.length; k += 1) {
      const data = new Date(this._year, this._month, k + 1).getTime();
      let current = true;

      if (new Date(data).getMonth() !== this._month) {
        current = false;
      }
      arrMain[k] = { data, current };
    }

    const res = [...arrBefore, ...arrMain];
    console.log({ res });
    this._monthList = res;
  }
}

export const listOfMonth = new MonthArray();

class DataContent {
  constructor() {
    this._data1 = "";
    this._data2 = "";
    this.currentDate = new Date();
    this.year = new Date().getFullYear();
    this.month = new Date().getMonth();
  }

  get data1() {
    return this._data1;
  }
  get data2() {
    return this._data2;
  }
  get currentData() {
    return this.currentData;
  }

  setDataOnClick(data) {
    if (!this._data1 && !this._data2) {
      this._data1 = data;
      return;
    }
    if (this._data1 && !this._data2 && data > this._data1) {
      this._data2 = data;
      return;
    }
    if (this._data1 && !this._data2 && data <= this._data1) {
      this._data1 = data;
      return;
    }
    if (this._data1 && this._data2 && data <= this._data1) {
      this._data1 = data;
      return;
    }

    if (this._data1 && this._data2 && data >= this._data1) {
      this._data2 = data;
      return;
    }
  }
}

export const dataContent = new DataContent();
