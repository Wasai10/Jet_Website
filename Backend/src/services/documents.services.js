const documentsRepo = require("../repository/documents.repository");

const getAllDocuments = async () => {
  return await documentsRepo.findAll();
};

const getDocumentById = async (id) => {
  const doc = await documentsRepo.findById(id);
  if (!doc) throw new Error("Document not found.");
  return doc;
};

const createDocument = async (data) => {
  if (!data.title || !data.fileUrl) {
    throw new Error("Title and document file are required.");
  }
  return await documentsRepo.create(data);
};

const deleteDocument = async (id) => {
  await getDocumentById(id);
  return await documentsRepo.remove(id);
};

module.exports = {
  getAllDocuments,
  getDocumentById,
  createDocument,
  deleteDocument,
};
