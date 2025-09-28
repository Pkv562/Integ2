const validateStudent = (req, res, next) => {
    const { name, age, grade } = req.body;

    if(!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({error: 'Invalid or missing name'});
    }

    if(!age || typeof age !== 'number' || age <= 0 ) {
        return res.status(400).json({error: 'Invalid or missing age'});
    }

    if(!grade || typeof grade !== 'string' || grade.trim() === '') {
        return res.status(400).json({error: 'Invalid or missing grade'});
    }

    next();
};

module.exports = { validateStudent };

