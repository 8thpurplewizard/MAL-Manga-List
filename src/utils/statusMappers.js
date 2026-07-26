export const getPublishingStatus = (statusNum) => {
  switch (statusNum) {
    case 1:
      return "Publishing";
    case 2:
      return "Completed";
    case 4:
      return "Hiatus";
    default:
      return "N/A";
  }
};

export const getUserStatus = (statusNum) => {
  switch (statusNum) {
    case 1:
      return "Reading";
    case 2:
      return "Read";
    case 3:
      return "On-Hold";
    case 4:
      return "Dropped";
    case 6:
      return "To-read";
    default:
      return "N/A";
  }
};
