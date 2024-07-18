const dataMethods = ["body", "params", "query", "headers"];

export const validation = (schema) => {
    return (req, res, next) => {
        const errorArr = [];

        dataMethods.forEach((key) => {
            if (schema[key]) {
                const { error } = schema[key].validate(req[key], { abortEarly: false });

                if (error) {
                    error.details.forEach((err) => {
                        errorArr.push(err.message);
                    });
                }
            }
        });

        if (errorArr.length) {
            return res.status(400).json({ error: errorArr });
        }

        next();
    };
};
