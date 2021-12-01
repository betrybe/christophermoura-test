const newError = ({ status, message }) => {
    const err = Error(message);
    err.status = status;
    throw err;
  };
  
  module.exports = { newError };