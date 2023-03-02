import { WEEK_DAYS, START_WEEK_DAY } from "../var.js";

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

export const isWeekend = (date, weekend) => {
  if (weekend.indexOf(new Date(date).getDay()) > -1) {
    return true;
  }
  return false;
};
