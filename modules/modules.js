import React from "react";

export default class Modules extends React.Component {}

//generate random instrument selection
Modules._getRandomIntInclusive = obj => {

  var result;
  var count = 0;
  for (var prop in obj) if (Math.random() < 1 / ++count) result = prop;
  return result;
};
