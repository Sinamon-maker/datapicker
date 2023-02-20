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

    this._monthList = res;
  }
}

export const listOfMonth = new MonthArray();

class Pickers {
  constructor() {
    this.pickers = {};
  }

  addPicker(picker) {
    const id = picker.id;
    if (typeof this.pickers[id] === "undefined") {
      this.pickers[id] = [picker];
    } else {
      if (this.pickers[id].length === 2) {
        throw new Error("More then 2 are not allowed");
      }
      if (this.pickers[id].length === 1) {
        picker.sibling = "second";
        picker.index = 1;
        console.log(picker.index);
        picker.data = ["", ""];
        this.pickers[id].push(picker);

        this.pickers[id][0].sibling = "first";
        this.pickers[id][0].data = ["", ""];
      }
    }
  }

  synchronyzeChoosedData(id, index, newData) {
    const pickers = this.pickers[id];

    const picker = pickers[index];
    const newArrDat = picker.data;
    if (newArrDat[index] === newData) {
      newArrDat[index] = "";
    } else {
      newArrDat[index] = newData;

      if (newArrDat[0] && newArrDat[1] && newArrDat[0] >= newArrDat[1]) {
        return;
      }
    }
    pickers.forEach((picker, ind) => {
      picker.data = newArrDat;
      picker.setLayout();
    });
  }

  synchronyzeMonthYearChanging(id, newDate) {
    const pickers = this.pickers[id];
    pickers.forEach((picker) => {
      picker.changeYearOrMonth(newDate);
      picker.setLayout();
      picker.setMonthLayout();
    });
  }
}
export const pickers = new Pickers();
