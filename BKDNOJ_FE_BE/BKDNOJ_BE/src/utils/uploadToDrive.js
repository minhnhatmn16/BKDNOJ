const fs = require("fs");
const { google } = require("googleapis");
const path = require("path");

const KEYFILEPATH = path.join(
  __dirname,
  "../security/bkdnoj-461512-668e7fc6c984.json"
);

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

async function deleteFileFromDrive(fileId) {
  const drive = google.drive({ version: "v3", auth: await auth.getClient() });
  try {
    await drive.files.delete({
      fileId: fileId,
    });
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}

async function uploadPDFToDrive(
  filePath,
  fileName = "file.pdf",
  parentFolderId = "1axQ0hNN-0jGKAv9bprQsuURAs3AkvSNH"
) {
  const drive = google.drive({ version: "v3", auth: await auth.getClient() });

  try {
    const response = await drive.files.list({
      q: `name='${fileName}' and '${parentFolderId}' in parents and trashed=false`,
      fields: "files(id, name)",
    });

    const existingFiles = response.data.files;

    if (existingFiles.length > 0) {
      for (const file of existingFiles) {
        await deleteFileFromDrive(file.id);
      }
    }
  } catch (error) {
    console.error("Error checking for existing files:", error);
  }

  const fileMetadata = {
    name: fileName,
    parents: [parentFolderId],
  };

  const media = {
    mimeType: "application/pdf",
    body: fs.createReadStream(filePath),
  };

  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    const fileId = file.data.id;

    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return `https://drive.google.com/file/d/${fileId}/preview`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

module.exports = {
  uploadPDFToDrive,
  deleteFileFromDrive,
};
