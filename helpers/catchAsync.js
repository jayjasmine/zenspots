
//Catch aysnc wrapper function 
//Wraps async requests so that if there's an error, catch it and pass it to next which executes custom error handler
module.exports = func => {
    return (req,res,next) => {
        func(req, res, next).catch(next);
    }
}