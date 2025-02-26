export interface DataApi {
  id: number;
  question: string;
  answer: string;
  keywords: string[];
  like_count: number;
  topic: string | null;
  images: string[];
  videos: string[];
  isSearchWithAI: boolean;
}

export interface ResultCardProps {
  id: number;
  result: DataApi;
  handleClickLike: (id: number) => void;
  handleClickSave: (id: number) => void;
  isLiked: boolean;
  isSaved: boolean;
}
