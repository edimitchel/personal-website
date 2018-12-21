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

export const getImage = post => {
  const { path, frontmatter } = post;
  const { image = "headline-image.png" } = frontmatter;

  if (image && image.indexOf("http") >= 0) {
    return image;
  }

  return "/images" + path + image;
};

import * as slugifyLib from "slugify";

export const slugify = s =>
  slugifyLib(s, {
    replacement: "-",
    lower: true
  });
