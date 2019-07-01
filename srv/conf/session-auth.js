'use strict'
// Session Auth
module.exports = (req, res, next) => {
	if (req.session && req.session.shop) {
		return next()
	}

	return res.sendStatus(401)
}