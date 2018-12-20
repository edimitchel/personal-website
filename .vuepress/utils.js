export const isBirthday = date => {
  const birthdate = new Date(date);
  const now = new Date();
  return (
    birthdate.getMonth() == now.getMonth() &&
    birthdate.getDate() == now.getDate()
  );
};

export const randomEmoji = list => {
  return list[Math.floor(Math.random() * list.length)];
};
