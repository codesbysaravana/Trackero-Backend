//most middlewares looks like this //GLOBAL ERROR HANDLING MIDDLEWARE

const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };

        error.message = err.message;;

        console.log(err);
        console.log(err.message);

        //Mongoose bad ObjectID;    
        if (err.name === 'CastError') {
            err.message = 'Resource Not Found';
            err.statusCode = 404;
        }


        //Mongoose Duplicate key;
        if(err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode = 400;
        }

        //Mongoose Validation error;
        if(err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(','));
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' });
    } catch (error) {
        next(error); //send to the next action saying a error occured
    }
};

export default errorMiddleware;