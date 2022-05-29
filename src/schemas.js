const Joi = require ('joi')

//Define Joi Schema for new/update zenspot form
module.exports.zenspotSchema = Joi.object({
    //Define data type and field requirements
    zenspot: Joi.object({
        title: Joi.string().required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required()
    }).required()
});

module.exports.newsSchema = Joi.object({
    news: Joi.object({
        title: Joi.string().required(),
        body: Joi.string().required()
    }).required()
});
