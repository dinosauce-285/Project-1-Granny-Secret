export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'Thiếu API key' });
  }
  
  if (apiKey !== "apikey") {
    return res.status(403).json({ error: 'API key không hợp lệ' });
  }
  
  next();
};

