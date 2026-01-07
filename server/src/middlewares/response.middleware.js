export function responseWrapper(req, res, next) {
  // -------------------------
  // SUCCESS: 200 OK
  // -------------------------
  res.ok = function (data, message = "Success") {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  };

  // -------------------------
  // SUCCESS: 201 CREATED
  // -------------------------
  res.created = function (message = "Created", data = null) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  };

  // -------------------------
  // ERROR HANDLER GENERIC
  // -------------------------
  res.error = function (message = "Error", errors = [], status = 400) {
    return res.status(status).json({
      success: false,
      message,
      errors,
    });
  };

  // -------------------------
  // ERROR 404: NOT FOUND
  // -------------------------
  res.notFound = function (message = "Not Found") {
    return res.status(404).json({
      success: false,
      message,
      errors: [],
    });
  };

  // -------------------------
  // NEXT
  // -------------------------
  next();
}
