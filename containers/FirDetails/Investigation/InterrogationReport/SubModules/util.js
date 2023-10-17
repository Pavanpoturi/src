import { notification } from "antd";
import {
  isString,
  isEmpty,
  isNumber,
  isPlainObject,
  forEach,
  isArray,
  has,
  first,
} from "lodash";
import axios from "axios";
import {
  getPersonDetails,
  getAddPersonFormValues,
} from "@containers/FirDetails/fir-util";
import { getMediaUploadError } from "@containers/FirDetails/fir-util";
import { config } from "@config/site.config";
import { actionMap, subModules } from "./const";

export const joinStrings = (strArr, separator = ", ") => {
  return strArr
    .filter((e) => !isEmpty(e) && (isString(e) || isNumber(e)))
    .join(separator);
};

export const getAddressString = (addressObj) =>
  isPlainObject(addressObj)
    ? joinStrings([
        addressObj?.address1,
        addressObj?.address2,
        addressObj?.city,
      ])
    : "";
export const getPersonString = (personObj) => {
  if (isPlainObject(personObj)) {
    if (has(personObj, "personalDetails.name"))
      personObj = personObj?.personalDetails || {};

    return joinStrings(
      [personObj?.name, personObj?.surname, personObj?.aliasName],
      " "
    );
  }

  return "";
};

export const getActionFieldValue = (data, actionType = null) => {
  switch (actionType) {
    case actionMap.addAddress:
      return getAddressString(data);
    case actionMap.addPerson:
      return getPersonString(data);
    default:
      if (has(data, "personalDetails.name") || has(data, "name"))
        return getPersonString(data);
      else if (has(data, "address1")) return getAddressString(data);
      return "";
  }
};

export const separateFields = (fieldValues) => {
  const normalFieldValues = {},
    actionFieldValues = {};
  forEach(fieldValues, (value, name) => {
    if (isPlainObject(value)) {
      // add person or add address
      actionFieldValues[name] = value;
      normalFieldValues[name] = getActionFieldValue(value, value?.action);
    } else if (isArray(value)) {
      // upload files
      actionFieldValues[name] = value;
    } else {
      // text field
      normalFieldValues[name] = value;
    } // TODO: need to add for datepicker fields should use moment
  });

  return [normalFieldValues, actionFieldValues];
};

export const mandatoryCheck = async (form) => {
  try {
    await form.validateFields();
    return true;
  } catch (error) {
    return false;
  }
};

const getRecordsPayloadCore = (value) => {
  switch (value?.action) {
    case actionMap.addAddress:
      return value;
    case actionMap.addPerson:
      return getPersonDetails(value);
    default:
      if (has(value, "name")) return getPersonDetails(value);
      else if (has(value, "address1")) return value;
      return value;
  }
};

export const getRecordsPayload = (records) => {
  if (isArray(records)) {
    const recordsPayload = [];
    for (const record of records) {
      const recordPayload = {};
      forEach(record, (value, key) => {
        if (isPlainObject(value)) {
          recordPayload[key] = getRecordsPayloadCore(value);
        } else {
          recordPayload[key] = value;
        }
      });
      recordsPayload.push(recordPayload);
    }
    return recordsPayload;
  }
  return [];
};

const getRecordsValueCore = (value) => {
  if (has(value, "address1")) return value;
  else if (has(value, "personalDetails.name"))
    return getAddPersonFormValues(value);
  return value;
};

export const getRecordsValue = (records) => {
  if (isArray(records)) {
    const recordsValue = [];
    for (const record of records) {
      const recordValue = {};
      forEach(record, (value, key) => {
        if (isPlainObject(value)) {
          recordValue[key] = getRecordsValueCore(value);
        } else {
          recordValue[key] = value;
        }
      });
      recordsValue.push(recordValue);
    }
    return recordsValue;
  }
  return [];
};

export const openNotification = (type, message) => {
  return notification[type]({
    message: message,
  });
};

export const uploadFiles = async (files, prefixFolder, folderPath) => {
  const uploadedFiles = [];
  if (isArray(files)) {
    for (const file of files) {
      if (!isEmpty(file?.originFileObj)) {
        const mediaFormData = new FormData();
        mediaFormData.append("file", file?.originFileObj);
        mediaFormData.append("prefixFolder", prefixFolder);
        mediaFormData.append("folderPath", folderPath);
        // TODO: needs refactor
        await axios
          .post(`${config.fileUpload}/upload`, mediaFormData)
          .then((response) => {
            if (response.data.success) {
              const { data } = response?.data;
              const payloadData = first(data);
              const payload = {
                mimeType: payloadData.mimeType,
                name: payloadData.name,
                url: payloadData.url,
                fileId: payloadData.id,
              };
              uploadedFiles.push(payload);
            }
          })
          .catch((err) => {
            getMediaUploadError(err, (type, message) => {
              notification[type]({
                message: message,
              });
            });
          });
      } else if (isString(file?.url) && isString(file?.fileId)) {
        uploadedFiles.push(file);
      }
    }
  }
  return uploadedFiles;
};

export const checkModuleMandatory = (selectedInterrogation) => {
  const messages = [];
  for (const submodule of subModules) {
    const { dataKey, title, isRequired } = submodule;
    if (isRequired && isEmpty(selectedInterrogation?.[dataKey])) {
      messages.push(`Please Fill ${title}`);
    }
  }
  return messages;
};
