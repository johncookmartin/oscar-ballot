import { api } from './api';

export interface NomineeDto {
  nomineeId: number;
  categoryId: number;
  nomineeName: string;
  isWinner: boolean;
}

export interface CategoryDto {
  categoryId: number;
  categoryName: string;
  displayOrder: number;
  nominees: NomineeDto[];
}

export interface LeaderboardEntry {
  userName: string;
  score: number;
}

export interface SubmissionEntry {
  userName: string;
}

export interface UserResultDto {
  categoryId: number;
  categoryName: string;
  displayOrder: number;
  pickedNomineeId: number | null;
  pickedNomineeName: string | null;
  winnerNomineeId: number | null;
  winnerNomineeName: string | null;
  isCorrect: boolean;
}

interface OkResponse<T> {
  ok: true;
  data: T;
}

export const oscarApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query<LeaderboardEntry[], void>({
      query: () => '/oscar/leaderboard',
      transformResponse: (res: OkResponse<LeaderboardEntry[]>) => res.data,
      extraOptions: { public: true },
    }),

    getCategories: builder.query<CategoryDto[], void>({
      query: () => '/oscar/categories',
      transformResponse: (res: OkResponse<CategoryDto[]>) => res.data,
      extraOptions: { public: true },
      providesTags: ['Categories'],
    }),

    getSubmissions: builder.query<SubmissionEntry[], void>({
      query: () => '/oscar/submissions',
      transformResponse: (res: OkResponse<SubmissionEntry[]>) => res.data,
      extraOptions: { public: true },
    }),

    getUserResults: builder.query<UserResultDto[], string>({
      query: (userName) =>
        `/oscar/users/${encodeURIComponent(userName)}/results`,
      transformResponse: (res: OkResponse<UserResultDto[]>) => res.data,
      extraOptions: { public: true },
    }),

    submitPicks: builder.mutation<void, { userName: string; picks: number[] }>({
      query: (body) => ({
        url: '/oscar/picks',
        method: 'POST',
        body,
      }),
      extraOptions: { public: true },
    }),

    setWinner: builder.mutation<void, number>({
      query: (nomineeId) => ({
        url: `/oscar/admin/winner/${nomineeId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Categories'],
    }),

    clearWinner: builder.mutation<void, number>({
      query: (nomineeId) => ({
        url: `/oscar/admin/winner/${nomineeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLeaderboardQuery,
  useGetCategoriesQuery,
  useGetSubmissionsQuery,
  useGetUserResultsQuery,
  useSubmitPicksMutation,
  useSetWinnerMutation,
  useClearWinnerMutation,
} = oscarApi;
