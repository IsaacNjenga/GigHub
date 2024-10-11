import moment from "moment";
import React from "react";

function CustomMoment({ postedTime }) {
  const now = moment();
  const duration = moment.duration(now.diff(moment(postedTime)));

  const years = Math.floor(duration.asYears());
  const months = Math.floor(duration.asMonths());
  const weeks = Math.floor(duration.asWeeks());
  const days = Math.floor(duration.asDays());
  const hours = Math.floor(duration.asHours() % 24);
  const minutes = Math.floor(duration.asMinutes() % 60);
  const seconds = Math.floor(duration.asSeconds() % 60);

  let formatted = "";

  if (years > 0) {
    formatted = `${years}y ago`;
  } else if (months > 0) {
    formatted = `${months}m ago`;
  } else if (weeks > 0) {
    formatted = `${weeks}w ago`;
  } else if (days > 0) {
    formatted = `${days}d ago`;
  } else if (hours > 0) {
    formatted = `${hours}h ago`;
  } else if (minutes > 0) {
    formatted = `${minutes}m ago`;
  } else {
    formatted = `${seconds}s ago`;
  }

  return <span>{formatted}</span>;
}

export default CustomMoment;
