const constants = {
  toast: {
    ADD_SUCCESS_MSG: "item successfully added",
    UPDATE_SUCCESS_MSG: "item successfully updated",
    UPDATE_DB_ERR_MSG: "Please check your fields, no rows have been updated.",
    DELETE_CONFIRM_MSG: "Are you sure you want to delete this item?",
    DELETE_ABORT_MSG: "Delete aborted.",
    valErr: {
      NO_EMPTY_FIELDS_MSG: "All fields must be filled out.",
      YEAR_FORMAT_MSG: "Year must be 4 digits",
      YEAR_TYPE_MSG: "Year must be a number.",
      NO_TRACKS_MSG: "Please add some tracks.",
      LOCATION_INVALID_MSG: "Location field does not contain a valid value.",
      NO_LOC_SEL_INCR_MSG: "Select a location to increment first.",
      NO_INCR_AVAIL_MSG: "That location can not be incremented.",
      NO_ACTIVE_FORM_MSG: "Please load a format's entry form first.",
      FORM_MISMATCH_MSG:
        "The active form does not match the format of the last entry.",
      TRACK_FORMAT_MSG: "Check your track data. Must be <artist>|<title>.",
      NO_ARTIST_MSG: "All tracks must have an artist",
      NO_TRACKNAME_MSG: "All tracks must have a track name",
      UPDATE_NO_ID_MSG: "Please enter an id to update.",
      UPDATE_NO_SEL_FORMAT_MSG: "Please select a format to update an item.",
      LOOKUP_NO_FIELD_MSG: "Please select a field to search.",
      LOOKUP_NOT_VALID_NUM_MSG:
        "Please enter a valid number to search by that field.",
      LOOKUP_YEAR_RANGE_MSG:
        "Please enter a valid 4 digit year between 1885 and the current year.",
    },
    ERROR_NO_COMPS_MSG: "No compilations found with that id.",
    ERROR_NO_SINGLES_MSG: "No singles found with that id.",
    ERROR_NO_CDS_MSG: "No cds found with that id.",
    ERROR_NO_RECORDS_MSG: "No records found with that id.",
    ERROR_NO_TAPES_MSG: "No tapes found with that id.",
  },
  data: {
    CDS_TEST_LOC_VAL_NO_NUM: "test_location_no_num",
    CDS_TEST_LOC_VAL_W_NUM: "test_location_w_num 1",
    CDS_TEST_LOC_VAL_W_INCR_NUM: "test_location_w_num 2",
    INVALID_LOCATION: "INVALID LOCATION NAME",
    VALID_LOCATION: "Good Location 47",
    INVALID_FORMAT_YEAR: "19805",
    INVALID_TYPE_YEAR: "Unicorn",
    VALID_FORMAT_YEAR: "1980",
    VALID_ARTIST: "Test Artist",
    VALID_TITLE: "Test Title",
    VALID_RECORD_LABEL: "Test Label",
    VALID_COMP_TRACK: "artist name|track name",
    VALID_SINGLES_TRACK: "trackname",
    MOCK_CD_DATA: {
      id: "id: 4747",
      artist: "MOCK CD MAIN ARTIST",
      title: "MOCK CD MAIN TITLE",
      location: "Jazz 1",
    },
  },
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
