// fn to avoid writing try catch on every async callback in routes 

module.exports = func =>{
    return (req,res,next) =>{
        func(req,res,next).catch(next);
    }
}