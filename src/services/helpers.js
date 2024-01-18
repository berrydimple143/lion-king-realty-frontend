import moment from 'moment';
import dayjs from 'dayjs';
const currencyFormatter = require('currency-formatter');

export const formatCurrency = (num, cur) =>
{
  return currencyFormatter.format(num, { code: cur });
}

export const sumOfValues = (arr) => 
{
  return arr.reduce((sum, a) => sum + a, 0);
}

export const computeBalance = (price, amountPaid, cur) =>
{
  const diff = price - amountPaid;
  return currencyFormatter.format(diff, { code: cur });
}

export const uploadURL = () =>
{
  return `${process.env.NEXT_PUBLIC_API}/api/documents/file-upload`;
}

export const processSales = (albums) =>
{
    let total = 0;
    albums.map((item, index) => {
        total += item.sales;
    });
    return total;
};

export const formatDate = (date, fmt) =>
{
    let newDate = moment(date).format(fmt);
    return newDate;
};

export const formatToDatePicker = (date, fmt) =>
{
    let newDate = dayjs(date, fmt);
    return newDate;
};

export const computeAge = (date) =>
{
    let a = moment();
    let b = moment(date, 'YYYY-MM-DD');
    let age = a.diff(b, 'years');
    return age;
};

export const computeDiff = (date) =>
{
    let a = moment();
    let b = moment(date, 'YYYY-MM-DD');
    let dif = b.diff(a, 'days');
    return dif;
};
