import { verifytoken } from "../Service/authentication.js"

export function checkForauthenticationcookie(cookieName) {
    return (req, res, next) => {
        const tokencookievalue = req.cookies[cookieName]
        if (!tokencookievalue) {
            return next()
        }


        const userpayload = verifytoken(tokencookievalue)
        req.user = userpayload




        return next()
    }

}