export interface Data {
  id: number;
  title: string;
  status: string;
}

export interface DataApi {
  question: string;
  id: number;
  question_answer_pair_id: number;
  status: string;
  created_at: string;
  rejected_reason: string;
  submitted_by_userid: number;
  submitted_by_username: string;
}

export interface DataApiChange {
  id: number; // Add the ID here
  old_object: {
    question: string;
    answer: string;
    keywords: string[];
    images: string[];
    videos: string[];
    topic: string | null;
  };
  new_object: {
    question: string;
    answer: string;
    keywords: string[];
    images: string[];
    videos: string[];
    topic: string | null;
  };
  diffs: {
    question_diff: [number, string][];
    answer_diff: [number, string][];
    images_diff: {
      added: string[];
      removed: string[];
    };
    videos_diff: {
      added: string[];
      removed: string[];
    };
  };
  status: string;
  reason: string | null;
}

export interface AdminData {
  id: number;
  title: string;
  status: string;
  name: string;
  image: string;
  date: string;
}

export interface AdminDataApi {
  id: number;
  question: string;
  status: string;
  created_at: string;
  submitted_by_userid: number;
  submitted_by_username: string;
}

export interface AdminDataChange {
  id: number;
  old_object: {
    question: string;
    answer: string;
    keywords: string[];
    images: string[];
    videos: string[];
    topic: string | null;
  };
  new_object: {
    question: string;
    answer: string;
    keywords: string[];
    images: string[];
    videos: string[];
    topic: string | null;
  };
  diffs: {
    question_diff: [number, string][];
    answer_diff: [number, string][];
    images_diff: {
      added: string[];
      removed: string[];
    };
    videos_diff: {
      added: string[];
      removed: string[];
    };
  };
  status: string;
}
