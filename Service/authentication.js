import JWT from "jsonwebtoken"

const secret = "$yestybaf"

export function CreateToken(user){
    const payload = {
        _id:user._id,
        email:user.email,
        profileimg:user.profileimg,
        role:user.role,
    }
    const token = JWT.sign(payload,secret);
    return token
}

export function verifytoken(token){
    const payload = JWT.verify(token,secret);
    return payload;
}