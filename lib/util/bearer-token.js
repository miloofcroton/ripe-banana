module.exports = (req, res, next) => {
    const authorization = req.get('Authorization');
    if(authorization) req.token = authorization.replace('Bearer ', '');
    next();
};
