import { WEEK_DAYS, START_WEEK_DAY } from "../var.js";

export const createMonthArray = (
  year = new Date().getFullYear(),
  month = new Date().getMonth()
) => {
  const weekDay = new Date(year, month, 1).getDay();
  const arrBefore = new Array(weekDay - START_WEEK_DAY.Sun).fill(0);

  for (let i = arrBefore.length - 1; i >= 0; i -= 1) {
    arrBefore[arrBefore.length - 1 - i] = new Date(year, month, 1 - i - 1);
  }

  const arrMain = new Array(5 * 7 - arrBefore.length).fill(0);

  for (let k = 0; k < arrMain.length; k += 1) {
    arrMain[k] = new Date(year, month, k + 1);
  }
  return [...arrBefore, ...arrMain];
};

export const isEquelToDate = (date1, currentDate) => {
  if (date1 === currentDate) {
    return true;
  }
  return false;
};

export const isDateBetween = (date, date1, date2) => {
  if (
    new Date(date).getTime() > new Date(date1).getTime() &&
    new Date(date).getTime() < new Date(date2).getTime()
  ) {
    return true;
  }
  return false;
};
