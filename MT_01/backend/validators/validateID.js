const validateID = (req, res, next) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'Invalid or missing ID' });
    }
    next();
};

module.exports = { validateID };