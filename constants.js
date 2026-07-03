const constants = {
  toast: {
    ADD_SUCCESS_MSG: "item successfully added",
    UPDATE_SUCCESS_MSG: "item successfully updated",
    UPDATE_DB_ERR: "Please check your fields, no rows have been updated.",
    valErr: {
      NO_EMPTY_FIELDS: "All fields must be filled out.",
      YEAR_FORMAT: "Year must be 4 digits",
      YEAR_TYPE: "Year must be a number.",
      NO_TRACKS: "Please add some tracks.",
      LOCATION_INVALID: "Location field does not contain a valid value.",
      NO_INCR_AVAIL: "You can not increment the singles locations.",
      NO_ACTIVE_FORM: "Please load a format's entry form first.",
      FORM_MISMATCH:
        "The active form does not match the format of the last entry.",
      TRACK_FORMAT: "Check your track data. Must be <artist>|<title>.",
      NO_ARTIST: "All tracks must have an artist",
      NO_TRACKNAME: "All tracks must have a track name",
    },
  },
  data: {},
  pageTitle: {
    UPDATE_PAGE_TITLE: "The Majewski Collection Update Items",
    ADD_PAGE_TITLE: "The Majewski Collection Add Items",
  },
  color: {
    ERROR: "red",
    SUCCESS: "green",
  },
};

export default constants;
