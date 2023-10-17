import { config, API_BASE_URL, API_KEY } from "@config/site.config";
import axios from "axios";
import { Spin, Alert } from "antd";
import { isEmpty } from "lodash";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";

// Get Uploaded File by File ID
export const getFileById = (fileId, fileName, fileURL) => {
  //if fileid is null or empty string then get fileId from URL
  //if it is not empty
  if (!fileId && typeof fileURL === "string" && fileURL.trim() !== "") {
    fileId = fileURL.substring(
      fileURL.lastIndexOf("nodes/") + 1,
      fileURL.lastIndexOf("/content")
    );
  }
  if (fileId) {
    fetch(`${config.downloadFile}?fileId=${fileId}`, {
      method: "GET",
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();
        link.parentNode.removeChild(link);
      });
  } else {
    console.log("Something Went Wrong");
  }
};

// Get Uploaded File by File ID
//this does not required url
//for mobile uploads, we don't have url field
export const getFileById2 = (fileId, fileName, mimeType) => {
  //if fileid is null or empty string then get fileId from URL
  //if it is not empty
  // console.log(`${API_BASE_URL}/api/media/downloadFileMobile?fileId=${fileId}&fileName=${fileName}&mimeType=${mimeType}`)
  if (fileId) {
    fetch(
      `${API_BASE_URL}/api/media/downloadFileMobile?fileId=${fileId}&fileName=${fileName}&mimeType=${mimeType}`,
      {
        method: "GET",
        headers: {
          apikey: API_KEY,
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();
        link.parentNode.removeChild(link);
      });
  } else {
    console.log("Something Went Wrong");
  }
};

export const getUrlFromMediaDetails = (fileId, fileName, mimeType) => {
  //it will never expire. URL based on fileId implementation
  if (fileId && fileName && mimeType) {
    return `${API_BASE_URL}/api/media/downloadFileMobile?fileId=${fileId}&fileName=${fileName}&mimeType=${mimeType}`;
  } else {
    return "";
  }
};

// Delete Uploaded File By ID
export const deleteFileById = (
  item,
  uploadedItems,
  actionName,
  notificationHelper
) => {
  if (item?.fileId) {
    axios
      .get(`${config.fileUpload}/delete?fileId=${item?.fileId}`)
      .then((response) => {
        if (response.status === 200) {
          // Filter remaning Uploaded Data
          const remaningUploadedData = uploadedItems.filter(
            (s) => s.fileId !== item?.fileId
          );
          // Return Back remaning items
          actionName(remaningUploadedData);
        }
      })
      .catch((err) => {
        console.log(err);
        notificationHelper("error", "Uploaing Went Wrong");
      });
  } else {
    console.log("Something Went Wrong");
  }
};

// Only applicable for PDF and images
export const displayFileBasedOnFileId = (data, action) => {
  !isEmpty(data) &&
    // eslint-disable-next-line array-callback-return
    data.map((s) => {
      let fileId = "";
      if (!s?.fileId && typeof s?.url === "string" && s?.url.trim() !== "") {
        fileId = s?.url.substring(
          s?.url.lastIndexOf("nodes/") + 1,
          s?.url.lastIndexOf("/content")
        );
      } else {
        fileId = s?.fileId;
      }
      if (s?.mimeType !== "application/msword" && fileId) {
        fetch(`${config.downloadFile}?fileId=${fileId}`, {
          method: "GET",
        })
          .then((response) => response.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              const base64data = reader.result;
              const result = {
                imgUrl: base64data,
                name: s?.team ? s?.team : s?.name,
                url: base64data,
                mimeType: s.mimeType,
              };
              action && action((dataUrl) => [...dataUrl, result]);
            };
          });
      }
    });
};

export const spinAlert = (tipText, message) => {
  return (
    <Spin tip={tipText}>
      <Alert message={message} type="info" />
    </Spin>
  );
};

export const saveAsExcel = async (data, fileName) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const fileData = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(fileData, fileName + ".xlsx");
};
