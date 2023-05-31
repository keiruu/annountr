const asyncHandler = (fn : any) => (req : { body: any; }, res : any , next : any) => {
    return Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = asyncHandler