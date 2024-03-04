import moment from 'moment';

export const formatTimeLastActivity = last_activity => {
  // const targetDate = moment(last_activity, 'DD-MM-YYYY HH:mm:ss');
  const now = moment().utc(true);
  const startDay = moment(last_activity, 'DD-MM-YYYY HH:mm:ss');

  const daysPassed = now.diff(startDay, 'days');

  if (daysPassed >= 1) {
    //Ngày đã trôi qua một ngày so với ngày hiện tại => hiện thêm ngày

    return startDay.format('DD-MM HH:mm');
  } else {
    //Ngày chưa trôi qua một ngày so với ngày hiện tại => chỉ hiện giờ

    return startDay.format('HH:mm');
  }
};
