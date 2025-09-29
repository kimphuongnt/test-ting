import axiosClient from "@/lib/axiosClient";
import { KolApiResponse } from "@/models/KolInformation";

export interface GetKolsParams {
  pageIndex?: number;
  pageSize?: number;
  keyword?: string;
  language?: string;
  active?: boolean;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export const getKols = async (params: GetKolsParams = {}): Promise<KolApiResponse> => {
  const response = await axiosClient.get<KolApiResponse>("/kols", {
    params: {
      pageIndex: params.pageIndex ?? 1,
      pageSize: params.pageSize ?? 10,
      keyword: params.keyword ?? "",
      Language: params.language ?? "",
      Active: params.active ?? true,
      sortBy: params.sortBy ?? "CreatedDate",
      sortDir: params.sortDir ?? "desc",
    },
  });

  return response.data;
};
