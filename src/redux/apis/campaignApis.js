import { baseApi } from "../baseAPi";
import { TagTypes } from "../tagTypes";

// BASE URL
const URL = "/v1.0/campaigns";

export const campaignApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL CAMPAIGNS
    getCampaigns: builder.query({
      query: (params) => ({
        url: `${URL}`,
        method: "GET",
        params,
      }),
      providesTags: [TagTypes.campaigns],
    }),

    // CREATE CAMPAIGN
    createCampaign: builder.mutation({
      query: (payload) => ({
        url: `${URL}`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [TagTypes.campaigns],
    }),

    // UPDATE CAMPAIGN
    updateCampaign: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `${URL}/${id}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: [TagTypes.campaigns],
    }),

    // DELETE CAMPAIGN
    deleteCampaign: builder.mutation({
      query: (id) => ({
        url: `${URL}/${Array.isArray(id) ? id.join(",") : id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.campaigns],
    }),

    // EVALUATE CART PROMOTIONS & CAMPAIGNS
    evaluateCartCampaigns: builder.mutation({
      query: (payload) => ({
        url: `${URL}/evaluate`,
        method: "POST",
        data: payload,
      }),
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  useEvaluateCartCampaignsMutation,
} = campaignApis;
