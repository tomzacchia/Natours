// Returned anonymous function is returned to controller function, which
// is then called whenever a request is made
module.exports = fn => {
  return (req, res, next) => {
    // fn is an async function, therefore we can catch errors thrown by promise
    fn(req, res, next).catch(err => next(err));
  };
};
