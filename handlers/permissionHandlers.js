export const updateOnly = (request, response, next) => {
    if (request.session.user.canUpdate) {
        return next();
    }
    response.status(403);
    return response.json({
        success: false
    });
};
