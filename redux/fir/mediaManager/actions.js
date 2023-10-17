const actions = {
  FETCH_MEDIA_REQUEST: "FETCH_MEDIA_REQUEST",
  FETCH_MEDIA_SUCCESS: "FETCH_MEDIA_SUCCESS",
  FETCH_MEDIA_ERROR: "FETCH_MEDIA_ERROR",

  UPLOAD_MEDIA_REQUEST: "UPLOAD_MEDIA_REQUEST",
  UPLOAD_MEDIA_SUCCESS: "UPLOAD_MEDIA_SUCCESS",
  UPLOAD_MEDIA_ERROR: "UPLOAD_MEDIA_ERROR",

  UPLOAD_TEMPLATES_REQUEST: "UPLOAD_TEMPLATES_REQUEST",
  UPLOAD_TEMPLATES_SUCCESS: "UPLOAD_TEMPLATES_SUCCESS",
  UPLOAD_TEMPLATES_ERROR: "UPLOAD_TEMPLATES_ERROR",

  RESET_TEMPLATES_ACTION_TYPE: "RESET_TEMPLATES_ACTION_TYPE",

  uploadMedia: (url, body) => ({
    type: actions.UPLOAD_MEDIA_REQUEST,
    payload: { url, body },
  }),

  getMediaList: (url, body) => ({
    type: actions.FETCH_MEDIA_REQUEST,
    payload: { url, body },
  }),

  uploadTemplates: (url, body) => ({
    type: actions.UPLOAD_TEMPLATES_REQUEST,
    payload: { url, body },
  }),

  resetTemplatesActionType: () => {
    return {
      type: actions.RESET_TEMPLATES_ACTION_TYPE,
    };
  },
};
export default actions;
