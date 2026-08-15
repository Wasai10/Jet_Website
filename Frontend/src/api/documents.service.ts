import { request, tokenStore } from "./auth.service";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000/api";

export interface MinistryDocument {
  id: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  filePublicId?: string | null;
  fileName?: string | null;
  fileSize?: string | null;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentPayload {
  title: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  category?: string;
}

export const documentsService = {
  async getAll(): Promise<MinistryDocument[]> {
    const data = await request<{ documents: MinistryDocument[] }>("GET", "/documents");
    return data.documents;
  },

  async create(payload: CreateDocumentPayload, file?: File): Promise<MinistryDocument> {
    if (file) {
      const form = new FormData();
      form.append("file", file);
      form.append("title", payload.title);
      if (payload.description) form.append("description", payload.description);
      if (payload.category) form.append("category", payload.category);
      if (payload.fileName) form.append("fileName", payload.fileName);

      const res = await fetch(`${API_URL}/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenStore.getAccess() ?? ""}` },
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Upload failed.");
      }
      const data = await res.json() as { message: string; document: MinistryDocument };
      return data.document;
    }

    const data = await request<{ message: string; document: MinistryDocument }>("POST", "/documents", payload);
    return data.document;
  },

  async remove(id: string): Promise<MinistryDocument> {
    const data = await request<{ message: string; document: MinistryDocument }>("DELETE", `/documents/${id}`);
    return data.document;
  },
};
