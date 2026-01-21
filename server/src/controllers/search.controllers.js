import { searchService } from "../services/search.services.js";

export const searchController = {
  async globalSearch(req, res) {
    const query = req.query.q || "";
    const result = await searchService.globalSearch(query, req.user?.userId);
    return res.ok(result);
  },
};
