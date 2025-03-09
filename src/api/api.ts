import { cacheAPI, https } from "./cacheHelper";

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
 * SEARCH APIs (with cache)
 * ========================== */
export const getResults = async (query: string) =>
  cacheAPI((url, params) => https.get(url, { params }), "/search-questions", {
    query,
  });

export const getResultsAI = async (query: string) =>
  cacheAPI((url, params) => https.get(url, { params }), "/search-ai", {
    query,
  });

export const getResultsByID = (id: number) =>
  cacheAPI((url) => https.get(url), `/question/${id}`);

/* ==========================
 * CHAT API
 * ========================== */
export const postChat = (data: Record<string, unknown>) =>
  https.post("/user-chat/", data);

export const postChatHistory = (data: Record<string, unknown>) =>
  https.post("/fetch-chat-history/", data);

export const clearChatHistory = (data: Record<string, unknown>) => {
  https.post("/clear-chat-history/", data);
};

/* ==========================
 * SAVED QUESTIONS APIs
 * ========================== */
export const getSaveQuestions = async (id: string) =>
  cacheAPI((url) => https.get(url), `/saved-questions/${id}`);

export const postLikeCount = (id: string, user_id: string) =>
  https.post(`/like-question/${id}/`, { user_id });

export const postSaveQuestion = (id: string, user_id: string) =>
  https.post(`/save-question/${id}/`, { user_id });

export const postDeleteSavedQuestion = (user_id: number, id: number) =>
  https.delete(`/delete-saved-question/${user_id}/${id}`);

/* ==========================
 * TOPIC MANAGEMENT APIs
 * ========================== */
export const getTopic = async () =>
  cacheAPI((url) => https.get(url), "/topics/hierarchy/");

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
  return cacheAPI(
    (url) =>
      https.get(url, {
        headers: { Authorization: `Bearer ${sessionid}` },
        withCredentials: true,
      }),
    "/questionanswerpair/changes/pending"
  );
};

export const getListPendingAdmin = async () => {
  const sessionid = getSessionId();
  if (!sessionid) {
    console.error("Session ID is missing. Cannot fetch pending admin changes.");
    throw new Error("Session ID is missing.");
  }
  return cacheAPI(
    (url) =>
      https.get(url, {
        headers: { Authorization: `Bearer ${sessionid}` },
        withCredentials: true,
      }),
    "/questionanswerpair/changes/"
  );
};

export const updateUserInfo = async (
  userId: string,
  updatedData: Partial<{ full_name: string; email: string; tier: string }>
) => {
  return https.patch(`/update-user/admin/${userId}/`, updatedData);
};

export const postDeleteUser = (id: string) => {
  return https.delete(`/users/admin/${id}/delete/`);
};

export const getListStatusUser = (id: number) =>
  cacheAPI((url) => https.get(url), `/questionanswerpair/changes/user/${id}/`);

export const getDetailsChanges = async (id: number) => {
  const sessionid = getSessionId();
  if (!sessionid) {
    console.error("Session ID is missing. Cannot fetch change details.");
    throw new Error("Session ID is missing.");
  }
  return cacheAPI(
    (url) =>
      https.get(url, {
        headers: { Authorization: `Bearer ${sessionid}` },
        withCredentials: true,
      }),
    `/questionanswerpair/changes/${id}/diffs/`
  );
};

export const postEditUser = async (username: string, full_name: string) => {
  const sessionid = localStorage.getItem("sessionid");

  if (!sessionid) {
    alert("Your session has expired. Please log in again.");
    window.location.href = "/login"; // Redirect user to login page
    throw new Error("Session ID is missing.");
  }

  return https.post(
    `/user/edit/`,
    { username, full_name },
    {
      headers: { Authorization: `Bearer ${sessionid}` }, // Attach session ID
      withCredentials: true, // Ensure cookies are sent
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
  return cacheAPI(
    (url) =>
      https.get(url, {
        headers: {
          Authorization: `Bearer ${sessionid}`,
        },
        withCredentials: true,
      }),
    `/get-users/admin/`
  );
};

export const getLikeAndSaveResult = (id: number, questionId: number) =>
  https.get(`/user/${id}/${questionId}/check-likes-saved/`);

export const postApproveOrReject = (
  id: number,
  payload: { action: string; rejected_reason: string }
) =>
  https.post(`/questionanswerpair/changes/${id}/approve_or_reject/`, payload);

export const getKeywordsById = (resultId: number) =>
  cacheAPI((url) => https.get(url), `/keywords/${resultId}`);

export const getKeywords = async (query: string) =>
  cacheAPI((url, params) => https.get(url, { params }), "/search-keywords/", {
    query,
  });

export const updateKeywords = async (resultId: number, keywords: number[]) =>
  https.put(`/update-keywords/${resultId}/`, { keywords });

export const getListKeywords = async () => {
  return https.get(`/get-keywords/`);
};

export const createKeyword = async (label: string) => {
  return https.post(`/create-keywords/`, { label });
};

export const deleteKeyword = async (id: number) => {
  return https.delete(`/delete-keywords/${id}/`);
};
