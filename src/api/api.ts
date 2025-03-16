import axios, { AxiosInstance } from "axios";

// Create an Axios instance
export const https: AxiosInstance = axios.create({
  baseURL: "https://b7concepts.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Allow sending credentials (cookies)
  timeout: 100000,
});

// Request interceptor for dynamic headers (adds session token if available)
https.interceptors.request.use((config) => {
  const sessionid = localStorage.getItem("sessionid");
  if (sessionid) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${sessionid}`;
  }
  return config;
});

// Helper function to retrieve session ID
const getSessionId = (): string | null => localStorage.getItem("sessionid");

/* ==========================
 * AUTHENTICATION APIs
 * ========================== */
export const postLogin = async (data: Record<string, unknown>) => {
  const response = await https.post("/login/", data);
  const sessionid = response.data?.sessionid;

  if (sessionid) {
    localStorage.setItem("sessionid", sessionid);
    console.log("Session ID stored:", sessionid);
  } else {
    console.error("Session ID is missing in the login response.");
  }

  return response;
};

export const postSignUp = (data: Record<string, unknown>) =>
  https.post("/signup/", data);

export const postLogOut = async () => {
  localStorage.removeItem("sessionid");
  localStorage.removeItem("accessToken");
  return https.post("/logout/");
};

/* ==========================
 * OTP & PASSWORD APIs
 * ========================== */
export const postToGetOtp = (data: Record<string, unknown>) =>
  https.post("/send-otp/", data);

export const postToVerifyOtp = (data: Record<string, unknown>) =>
  https.post("/verify-otp/", data);

export const postToResetPassword = (data: Record<string, unknown>) =>
  https.post("/verify-otp-and-reset-password/", data);

/* ==========================
 * SEARCH APIs
 * ========================== */
export const getResults = async (query: string) =>
  https.get("/search-questions", { params: { query } });

export const getResultsAI = async (query: string) =>
  https.get("/search-ai", { params: { query } });

export const getResultsByID = (id: number) => https.get(`/question/${id}`);

/* ==========================
 * CHAT API
 * ========================== */
export const postChat = (data: Record<string, unknown>) =>
  https.post("/user-chat/", data);

export const postChatHistory = (data: Record<string, unknown>) =>
  https.post("/fetch-chat-history/", data);

export const clearChatHistory = (data: Record<string, unknown>) =>
  https.post("/clear-chat-history/", data);

/* ==========================
 * SAVED QUESTIONS APIs
 * ========================== */
export const getSaveQuestions = async (id: string) =>
  https.get(`/saved-questions/${id}`);

export const postLikeCount = (id: string, user_id: string) =>
  https.post(`/like-question/${id}/`, { user_id });

export const postSaveQuestion = (id: string, user_id: string) =>
  https.post(`/save-question/${id}/`, { user_id });

export const postDeleteSavedQuestion = (user_id: number, id: number) =>
  https.delete(`/delete-saved-question/${user_id}/${id}`);

/* ==========================
 * TOPIC MANAGEMENT APIs
 * ========================== */
export const getTopic = async () => https.get("/topics/hierarchy/");

export const postAddNewTopic = (name: string, parent_id: string | null) =>
  https.post("/topics/add/", { name, parent_id });

export const postRenameTopic = (id: string, new_name: string) =>
  https.post(`/topics/${id}/rename/`, { new_name });

export const postMoveTopic = (id: string, new_parent_id: number) =>
  https.post(`/topics/${id}/move/`, { new_parent_id });

export const postDeleteTopic = (id: number) =>
  https.delete(`/topics/${id}/delete/`);

/* ==========================
 * QUESTION IMAGE & CHANGES APIs
 * ========================== */
export const postAddResultToTopic = async (
  body: Record<string, unknown>,
  topicId: string
) => {
  const response = await https.post(`/topics/${topicId}/add-result/`, body);
  return response;
};

export const postNewResult = async (body: Record<string, unknown>) => {
  const response = await https.post(`/new-result/`, body);
  return response;
};

export const postUpLoadImage = async (id: string, file: File) => {
  const response = await https.post(
    `/questionanswerpair/${id}/upload_image/`,
    file,
    {
      headers: {
        "Content-Type": file.type,
      },
    }
  );
  return response?.data?.image_url;
};

export const postUploadVideo = async (id: string, file: File) => {
  const response = await https.post(
    `/questionanswerpair/${id}/upload_video/`,
    file,
    {
      headers: {
        "Content-Type": file.type,
      },
    }
  );
  return response?.data?.video_url || null;
};

export const postSubmitChange = (id: number, body: Record<string, unknown>) =>
  https.post(`/questionanswerpair/${id}/submit_changes/`, body);

export const getListPendingEditor = async () => {
  const sessionid = getSessionId();
  if (!sessionid) {
    console.error(
      "Session ID is missing. Cannot fetch pending editor changes."
    );
    throw new Error("Session ID is missing.");
  }
  return https.get("/questionanswerpair/changes/pending", {
    headers: { Authorization: `Bearer ${sessionid}` },
    withCredentials: true,
  });
};

export const getListPendingAdmin = async () => {
  const sessionid = getSessionId();
  if (!sessionid) {
    console.error("Session ID is missing. Cannot fetch pending admin changes.");
    throw new Error("Session ID is missing.");
  }
  return https.get("/questionanswerpair/changes/", {
    headers: { Authorization: `Bearer ${sessionid}` },
    withCredentials: true,
  });
};

export const updateUserInfo = async (
  userId: string,
  updatedData: Partial<{ full_name: string; email: string; tier: string }>
) => {
  return https.patch(`/update-user/admin/${userId}/`, updatedData);
};

export const postDeleteUser = (id: string) =>
  https.delete(`/users/admin/${id}/delete/`);

export const getListStatusUser = (id: number) =>
  https.get(`/questionanswerpair/changes/user/${id}/`);

export const getDetailsChanges = async (id: number) => {
  const sessionid = getSessionId();
  if (!sessionid) {
    console.error("Session ID is missing. Cannot fetch change details.");
    throw new Error("Session ID is missing.");
  }
  return https.get(`/questionanswerpair/changes/${id}/diffs/`, {
    headers: { Authorization: `Bearer ${sessionid}` },
    withCredentials: true,
  });
};

export const postEditUser = async (username: string, full_name: string) => {
  const sessionid = getSessionId();

  if (!sessionid) {
    alert("Your session has expired. Please log in again.");
    window.location.href = "/login"; // Redirect user to login page
    throw new Error("Session ID is missing.");
  }

  return https.post(
    `/user/edit/`,
    { username, full_name },
    {
      headers: { Authorization: `Bearer ${sessionid}` },
      withCredentials: true,
    }
  );
};

export const postChangePassword = (
  username: string,
  old_password: string,
  new_password: string
) => https.post(`/change-password/`, { username, old_password, new_password });

export const getAllUsers = async () => {
  const sessionid = getSessionId();
  if (!sessionid) {
    console.error("Session ID is missing. Cannot fetch users.");
    throw new Error("Session ID is missing.");
  }
  return https.get("/get-users/admin/", {
    headers: {
      Authorization: `Bearer ${sessionid}`,
    },
    withCredentials: true,
  });
};

export const getLikeAndSaveResult = (id: number, questionId: number) =>
  https.get(`/user/${id}/${questionId}/check-likes-saved/`);

export const postApproveOrReject = (
  id: number,
  payload: { action: string; rejected_reason: string }
) =>
  https.post(`/questionanswerpair/changes/${id}/approve_or_reject/`, payload);

export const getKeywordsById = (resultId: number) =>
  https.get(`/keywords/${resultId}`);

export const getKeywords = async (query: string) =>
  https.get("/search-keywords/", { params: { query } });

export const updateKeywords = async (resultId: number, keywords: number[]) =>
  https.put(`/update-keywords/${resultId}/`, { keywords });

export const getListKeywords = async () => https.get(`/get-keywords/`);

export const createKeyword = async (label: string) =>
  https.post(`/create-keywords/`, { label });

export const deleteKeyword = async (id: number) =>
  https.delete(`/delete-keywords/${id}/`);
