const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }
    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
}

const unauthorizedError = (err, req, res, next) => {
    if (err.status === 401) {
        res.status(401).json({ message: "Non autorisé - Veuillez vérifier vos informations d'identification" });
    } else {
        next(err);
    }
};

module.exports = { notFound, errorHandler, unauthorizedError };